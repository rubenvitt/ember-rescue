import { FahrzeugTemplateDto } from '@bluelight-hub/shared/client/index.js';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Button, Collapse, Form, Input, InputNumber, Select, Switch, Table, Tooltip, Typography } from 'antd';
import type { AnyObject } from 'antd/es/_util/type.js';
import { Rule } from 'antd/es/form/index.js';
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import { HTMLAttributes, PropsWithChildren, ReactElement, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { PiCheck, PiCode, PiFingerprint, PiPencil, PiPlus, PiTrash, PiX } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { useFahrzeuge } from '../../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { useOpta } from '../../../../hooks/opta.hook.js';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { OptaInput } from '../../molecules/OptaInput.component.js';
import { FormLayout } from '../form/FormLayout.comonent.js';

type EditingStore = {
  id: null | string;
  isEditing: (id: string) => boolean;
  setEditingId: (id: string) => void;
  resetEditingId: () => void;
};

const useEditingStore = create<EditingStore>((setState, getState) => ({
  id: null,
  isEditing(id: string) {
    return getState().id === id;
  },
  setEditingId: (id) => setState({ id }),
  resetEditingId: () => setState({ id: null }),
}));

type EditableColumnsType<RecordType = AnyObject> = ((ColumnGroupType<RecordType> | ColumnType<RecordType>) & {
  editable?: boolean;
  dataIndex?: string;
})[];

function selectInputType(dataIndex?: string) {
  switch (dataIndex) {
    case 'fahrzeugTyp':
      return 'select';
    case 'opta':
      return 'opta';
    case 'kapazitaet':
      return 'number';
  }
}

const fahrzeugCreateId = 'create.fahrzeug';
const newFahrzeugTemplate: FahrzeugTemplateDto = {
  opta: {
    id: 'custom',
    fullOpta: 'NI Rotkreuz Uelzen 40-12-1',
    district: 'NI',
    bosCode: 'Rotkreuz',
    ort: 'Uelzen',
    localCode: '40',
    functionCode: '12',
    orderNumber: '1',
  },
  fullOpta: 'NI Rotkreuz Uelzen 40-12-1',
  kapazitaet: 0,
  id: fahrzeugCreateId,
  iconDefinition: {},
};

// FIXME: type
type EditableFahrzeugType = FahrzeugTemplateDto;

function JsonImExport() {
  const { fahrzeugeJson, updateFahrzeugeJson } = useFahrzeuge();
  const [importForm] = Form.useForm();
  const [exportForm] = Form.useForm();

  useEffect(() => {
    if (!importForm.isFieldsTouched()) {
      importForm.setFieldsValue({
        json: fahrzeugeJson.data,
      });
    }
    exportForm.setFieldsValue({
      json: fahrzeugeJson.data,
    });
  }, [fahrzeugeJson.data]);

  return (
    <Collapse ghost={true} bordered={false} className="w-full">
      <Collapse.Panel header="Erweiterte Funktionen" key="1" className="w-full text-left" collapsible={fahrzeugeJson.isLoading ? 'disabled' : 'header'}>
        <div className="flex justify-items-stretch gap-4">
          <FormLayout<{ json: string }>
            buttons={{
              submit: {
                children: <>Fahrzeuge kopieren</>,
                htmlType: 'submit',
                icon: <PiCode size={24} />,
                variant: 'dashed',
              },
            }}
            form={{
              ...exportForm,
              className: 'flex flex-1 flex-col justify-between',
              initialValues: { json: fahrzeugeJson.data },
              async onFinish() {
                await writeText(fahrzeugeJson.data ?? '', { label: 'Fahrzeuge.json' });
                toast.success('Fahrzeuge.json wurde kopiert');
              },
            }}
          >
            <Typography.Text>Export-JSON</Typography.Text>
            <InputWrapper name="json">
              <Input.TextArea
                rows={6}
                onFocus={(e) =>
                  setTimeout(async () => {
                    e.target.select();
                  })
                }
              />
            </InputWrapper>
          </FormLayout>

          <FormLayout<{ json: string }>
            form={{
              ...importForm,
              initialValues: { json: fahrzeugeJson.data },
              validateTrigger: 'onBlur',
              async onFinish(data) {
                await updateFahrzeugeJson.mutateAsync(data, {
                  onSuccess() {
                    toast.success('JSON erfolgreich eingespielt');
                  },
                  onError() {
                    toast.warning('Fehler beim Einspielen der Fahrzeuge-JSON');
                  },
                });
              },
              className: 'flex flex-1 flex-col justify-between',
            }}
            buttons={{
              submit: {
                children: <>Fahrzeuge speichern (kaputt 😭)</>,
                disabled: true,
                htmlType: 'submit',
                icon: <PiCode size={24} />,
                variant: 'dashed',
              },
            }}
          >
            <Typography.Text>Import-JSON</Typography.Text>
            <InputWrapper
              name={'json'}
              rules={[
                {
                  validator(_, value) {
                    try {
                      JSON.parse(value);
                    } catch (e) {
                      return Promise.reject('Invalid JSON format');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.TextArea name="json" rows={6} />
            </InputWrapper>
          </FormLayout>
        </div>
      </Collapse.Panel>
    </Collapse>
  );
}

function filterDataSource(data: (FahrzeugTemplateDto | undefined)[]): FahrzeugTemplateDto[] {
  return data.filter((item): item is FahrzeugTemplateDto => item !== undefined);
}

export function EditableFahrzeugeTable() {
  const [form] = Form.useForm<EditableFahrzeugType>();
  const { templateFahrzeuge, patchFahrzeuge, removeVehicleTemplate, fahrzeugeTypen } = useFahrzeuge();
  const { isEditing, setEditingId, id, resetEditingId } = useEditingStore();
  const { functionOpta } = useOpta();

  const cancel = useCallback(resetEditingId, [resetEditingId]);
  const remove = useCallback(async () => {
    console.log('Removing', id);
    await removeVehicleTemplate.mutateAsync(id!!);
    resetEditingId();
  }, [id]);

  const functionCodeMap = useMemo(() => {
    return new Map(functionOpta.data?.data.map((opta) => [opta.code, opta]));
  }, [functionOpta.data]);

  const editingFahrzeugTemplate = useMemo(() => {
    if (newFahrzeugTemplate.id === id) {
      return newFahrzeugTemplate;
    }
    return templateFahrzeuge.data?.data?.find((template) => template.id === id);
  }, [templateFahrzeuge.data, id]);

  const fahrzeugeTypItems = useMemo(() => {
    return (
      fahrzeugeTypen.data?.data.map(
        (fahrzeugTyp) =>
          ({
            value: fahrzeugTyp.id,
            search: [fahrzeugTyp.label, fahrzeugTyp.description].join(' '),
            label: (
              <div className="flex justify-between">
                <span>{fahrzeugTyp.label}</span>
                <span>{fahrzeugTyp.description}</span>
              </div>
            ),
          }) satisfies DefaultOptionType,
      ) ?? []
    );
  }, [fahrzeugeTypen.data]);

  function selectOptions(dataIndex?: string) {
    switch (dataIndex) {
      case 'fahrzeugTyp':
        return fahrzeugeTypItems;
      default:
        return undefined;
    }
  }

  useEffect(() => {
    console.log('Effect triggered with editingFahrzeug:', editingFahrzeugTemplate);

    if (!editingFahrzeugTemplate) {
      console.log('No editingFahrzeug, returning early');
      return;
    }

    console.log('About to reset form with values:', {
      id: editingFahrzeugTemplate.id,
      kapazitaet: editingFahrzeugTemplate.kapazitaet,
      fullOpta: editingFahrzeugTemplate.fullOpta,
      opta: { ...editingFahrzeugTemplate.opta },
      iconDefinition: editingFahrzeugTemplate.iconDefinition ?? {},
    });

    form.setFieldsValue({
      id: editingFahrzeugTemplate.id,
      kapazitaet: editingFahrzeugTemplate.kapazitaet,
      fullOpta: editingFahrzeugTemplate.fullOpta,
      opta: { ...editingFahrzeugTemplate.opta },
      iconDefinition: editingFahrzeugTemplate.iconDefinition ?? {},
    });

    // Nach dem Reset prüfen
    console.debug('Form values after reset:', form.getFieldsValue());
  }, [editingFahrzeugTemplate]);

  const columns = useMemo<EditableColumnsType<FahrzeugTemplateDto>>(
    () => [
      {
        title: 'Interne ID',
        dataIndex: 'id',
        editable: false,
        width: 100,
        render: (value) => {
          if (value === fahrzeugCreateId) return null;
          return (
            <Tooltip
              title={value}
              trigger={'click'}
              onOpenChange={async (visible) => {
                if (visible) return await writeText(value);
              }}
            >
              <Button type="text" shape="circle">
                <PiFingerprint />
              </Button>
            </Tooltip>
          );
        },
      },
      { title: 'Opta', dataIndex: 'opta', editable: true, render: (opta) => opta.fullOpta },
      {
        title: 'Typ des Fahrzeugs',
        dataIndex: 'fahrzeugTyp',
        editable: false,
        render: (_, record) => {
          if (!record.opta.functionCode) {
            return null;
          }

          const functionOpta = functionCodeMap.get(record.opta.functionCode);
          if (!functionOpta) {
            return record.opta.functionCode;
          }
          return (
            <div>
              <p>
                {functionOpta.code} - {functionOpta.label}
              </p>
              <p className="text-sm text-gray-600">{functionOpta.group}</p>
            </div>
          );
        },
      },
      { title: 'Standardanzahl Kräfte', dataIndex: 'kapazitaet', editable: true },
      {
        title: (
          <div className="flex justify-center">
            <Tooltip title="Neue Fahrzeug hinzufügen">
              <Button icon={<PiPlus />} onClick={() => setEditingId(fahrzeugCreateId)} />
            </Tooltip>
          </div>
        ),
        dataIndex: 'actions',
        render: (_, record) => {
          const editing = isEditing(record.id);
          if (editing) {
            return (
              <div className="flex justify-around">
                {id !== fahrzeugCreateId && (
                  <div>
                    <Tooltip title="Fahrzeugvorlage löschen">
                      <Button danger onClick={remove} icon={<PiTrash />} />
                    </Tooltip>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Tooltip title="Bearbeitung abbrechen">
                    <Button danger onClick={cancel} icon={<PiX />} />
                  </Tooltip>
                  <Tooltip title="Änderungen bestätigen">
                    <Button type="primary" htmlType="submit" icon={<PiCheck />} loading={patchFahrzeuge.isPending} />
                  </Tooltip>
                </div>
              </div>
            );
          }
          return (
            <div className="flex justify-center">
              <Button
                type="text"
                icon={<PiPencil />}
                onClick={() => {
                  form.setFieldsValue(record);
                  setEditingId(record.id);
                }}
              />
            </div>
          );
        },
      },
    ],
    [templateFahrzeuge.data],
  );

  const mergedColumns = useMemo(
    () =>
      columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        // noinspection JSUnusedGlobalSymbols, onCell is used.
        return {
          ...col,
          onCell: (record: FahrzeugTemplateDto) => ({
            record,
            inputType: selectInputType(col.dataIndex),
            options: selectOptions(col.dataIndex),
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record.id),
          }),
        };
      }),
    [columns, isEditing],
  );

  const dataSource = useMemo(
    () => filterDataSource([id === newFahrzeugTemplate.id ? [newFahrzeugTemplate] : undefined, templateFahrzeuge.data?.data].filter((value) => value !== undefined).flat()),
    [newFahrzeugTemplate, id, templateFahrzeuge.data?.data],
  );
  return (
    <>
      <Typography.Title level={3}>Fahrzeug-Template Verwaltung</Typography.Title>
      <Form<EditableFahrzeugType>
        form={form}
        validateTrigger={['onBlur', 'onSubmit']}
        onFinishFailed={() => {
          toast.error('Fehler beim Bearbeiten des Fahrzeugs');
        }}
        onFinish={async (data) => {
          await patchFahrzeuge.mutateAsync({ items: [{ ...data, id: id === fahrzeugCreateId ? undefined : (id as string) }] });
          resetEditingId();
          toast.success('Fahrzeug erfolgreich gespeichert');
        }}
        initialValues={{
          id: editingFahrzeugTemplate?.id ?? '',
          fullOpta: editingFahrzeugTemplate?.fullOpta ?? '',
          kapazitaet: editingFahrzeugTemplate?.kapazitaet ?? 0,
          opta: {
            id: editingFahrzeugTemplate?.opta.id ?? '',
            fullOpta: editingFahrzeugTemplate?.opta.fullOpta ?? '',
            ort: editingFahrzeugTemplate?.opta.ort ?? '',
            district: editingFahrzeugTemplate?.opta.district ?? '',
            bosCode: editingFahrzeugTemplate?.opta.bosCode ?? '',
            localCode: editingFahrzeugTemplate?.opta.localCode ?? '',
            functionCode: editingFahrzeugTemplate?.opta.functionCode ?? '',
            orderNumber: editingFahrzeugTemplate?.opta.orderNumber ?? '',
          },
          iconDefinition: editingFahrzeugTemplate?.iconDefinition ?? {},
        }}
      >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          loading={templateFahrzeuge.isLoading}
          // @ts-ignore
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            pageSize: 10,
            onChange: cancel,
          }}
        />
      </Form>
      <JsonImExport />
    </>
  );
}

interface EditableCellProps<Item> extends HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'checkbox' | 'select' | 'opta';
  options?: DefaultOptionType[];
  record: Item;
  index: number;
}

function getMin(dataIndex: string) {
  if (dataIndex === 'kapazitaet') {
    return 0;
  }
}

function EditableCell<Item>({ editing, dataIndex, title, inputType, record, index, options, children, ...restProps }: PropsWithChildren<EditableCellProps<Item>>): ReactNode {
  let inputNode: ReactElement;
  switch (inputType) {
    case 'number':
      inputNode = <InputNumber min={getMin(dataIndex)} />;
      break;
    case 'text':
      inputNode = <Input />;
      break;
    case 'checkbox':
      inputNode = <Switch />;
      break;
    case 'select':
      inputNode = (
        <Select
          options={options}
          showSearch
          filterOption={(inputValue, option) => {
            // Create a regular expression that matches the characters of inputValue in sequence, ignoring spaces.
            const regex = new RegExp(inputValue.split('').join('.*'), 'i');
            return regex.test(option?.search);
          }}
        />
      );
      break;
    case 'opta':
      inputNode = (
        <OptaInput
        // name={dataIndex}
        // onChange={(opta) => {
        //   console.log(`neue Opta: ${JSON.stringify(opta)}`);
        // }}
        />
      );
      break;
  }

  //         {/*// const PatchFahrzeugSchema = Yup.object().shape({*/}
  //         {/*//   kapazitaet: Yup.number().required('Kapazitaet wird benötigt').min(0, 'Eine negative Stärke ist unzulässig.'),*/}
  //         {/*//   fullOpta: Yup.string().required('Ein Opta wird benötigt'),*/}
  //         {/*// });*/}
  return (
    <td {...restProps}>
      {editing ? (
        <InputWrapper
          className="m-0"
          name={dataIndex}
          rules={
            [
              dataIndex === 'kapazitaet'
                ? {
                    type: 'number',
                    required: true,
                    message: 'Kapazität wird benötigt',
                    min: 0,
                  }
                : null,
              dataIndex === 'fullOpta'
                ? {
                    required: true,
                    message: 'Eine Opta wird benötigt',
                  }
                : null,
            ].filter((value) => value !== null && value !== undefined) as Rule[]
          }
        >
          {inputNode}
        </InputWrapper>
      ) : (
        children
      )}
    </td>
  );
}
