import { HTMLAttributes, PropsWithChildren, ReactElement, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Button, Collapse, Form, Input, InputNumber, Select, Switch as AntSwitch, Switch, Table, Tooltip, Typography } from 'antd';
import { useFahrzeuge } from '../../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { create } from 'zustand';
import { PiCheck, PiCode, PiFingerprint, PiPencil, PiPlus, PiX } from 'react-icons/pi';
import type { AnyObject } from 'antd/es/_util/type.js';
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { toast } from 'react-toastify';
import { FormLayout } from '../form/FormLayout.comonent.js';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { OptaInputField } from '../../molecules/OptaInput.component.js';
import { FahrzeugTemplateDto } from '@bluelight-hub/shared/client/index.js';
import { Rule } from 'antd/es/form/index.js';

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
  setEditingId: (id: string) => setState({ id }),
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
    case 'istTemporaer':
      return 'checkbox';
  }
}

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
  id: 'create.fahrzeug',
  iconDefinition: {},
};

// FIXME: type
type EditableFahrzeugType = FahrzeugTemplateDto;

function JsonImExport() {
  const { fahrzeugeJson, updateFahrzeugeJson } = useFahrzeuge();
  const [importForm] = Form.useForm();
  const [exportForm] = Form.useForm();
  // const exportFormikRef = useRef<FormikProps<{ json: string }>>(null);
  // const importFormikRef = useRef<FormikProps<{ json: string }>>(null);

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
            <InputWrapper name={'json'}>
              TODO
              {/*<Input.TextArea*/}
              {/*  name="json"*/}
              {/*  rows={6}*/}
              {/*  onFocus={(e) =>*/}
              {/*    setTimeout(async () => {*/}
              {/*      e.target.select();*/}
              {/*    })*/}
              {/*  }*/}
              {/*/>*/}
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
                children: <>Fahrzeuge speichern</>,
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

export function EditableFahrzeugeTable() {
  const [form] = Form.useForm();
  const { templateFahrzeuge, patchFahrzeuge, fahrzeugeTypen } = useFahrzeuge();
  const { isEditing, setEditingId, id, resetEditingId } = useEditingStore();

  const cancel = useCallback(resetEditingId, [resetEditingId]);

  const editingFahrzeug = useMemo(() => {
    if (newFahrzeugTemplate.id === id) {
      return newFahrzeugTemplate;
    }
    return templateFahrzeuge.data?.data?.find((fahrzeug) => fahrzeug.id === id);
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
    console.log('Effect triggered with editingFahrzeug:', editingFahrzeug);

    if (!editingFahrzeug) {
      console.log('No editingFahrzeug, returning early');
      return;
    }

    console.log('About to reset form with values:', {
      id: editingFahrzeug.id,
      kapazitaet: editingFahrzeug.kapazitaet,
      fullOpta: editingFahrzeug.fullOpta,
      opta: { ...editingFahrzeug.opta },
      iconDefinition: editingFahrzeug.iconDefinition ?? {},
    });

    form.setFieldsValue({
      id: editingFahrzeug.id,
      kapazitaet: editingFahrzeug.kapazitaet,
      fullOpta: editingFahrzeug.fullOpta,
      opta: { ...editingFahrzeug.opta },
      iconDefinition: editingFahrzeug.iconDefinition ?? {},
    });

    // Nach dem Reset prüfen
    console.trace('Form values after reset:', form.getFieldsValue());
  }, [editingFahrzeug]);

  const columns = useMemo<EditableColumnsType<FahrzeugTemplateDto>>(
    () => [
      {
        title: 'Interne ID',
        dataIndex: 'id',
        editable: false,
        width: 100,
        render: (value) => {
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
        render: (_, record) => record.opta.functionCode,
      },
      { title: 'Standardanzahl Kräfte', dataIndex: 'kapazitaet', editable: true },
      {
        title: 'Temporär',
        dataIndex: 'istTemporaer',
        editable: true,
        render: (value) => <AntSwitch value={value} disabled={true} />,
      },
      {
        title: (
          <div className="flex justify-center">
            <Tooltip title="Neue Fahrzeug hinzufügen">
              <Button icon={<PiPlus />} onClick={() => setEditingId('create.fahrzeug')} />
            </Tooltip>
          </div>
        ),
        dataIndex: 'actions',
        render: (_, record) => {
          const editing = isEditing(record.id);
          if (editing) {
            return (
              <div className="flex justify-around">
                <Tooltip title="Bearbeitung abbrechen">
                  <Button danger onClick={cancel} icon={<PiX />} />
                </Tooltip>
                <Tooltip title="Änderungen bestätigen">
                  <Button type="primary" onClick={form.submit} icon={<PiCheck />} loading={patchFahrzeuge.isPending} />
                </Tooltip>
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
    () => [id === newFahrzeugTemplate.id ? [newFahrzeugTemplate] : undefined, templateFahrzeuge.data?.data].filter((value) => value !== undefined).flat(),
    [newFahrzeugTemplate, id, templateFahrzeuge.data?.data],
  );
  return (
    <>
      <Form<EditableFahrzeugType>
        form={form}
        validateTrigger={['onBlur', 'onSubmit']}
        onFinish={async (data) => {
          console.log('submitting with data', { data });
          await patchFahrzeuge.mutateAsync({ items: [data] });
          resetEditingId();
        }}
        initialValues={{
          id: editingFahrzeug?.id ?? '',
          fullOpta: editingFahrzeug?.fullOpta ?? '',
          kapazitaet: editingFahrzeug?.kapazitaet ?? 0,
          opta: {
            id: editingFahrzeug?.opta.id ?? '',
            fullOpta: editingFahrzeug?.opta.fullOpta ?? '',
            ort: editingFahrzeug?.opta.ort ?? '',
            district: editingFahrzeug?.opta.district ?? '',
            bosCode: editingFahrzeug?.opta.bosCode ?? '',
            localCode: editingFahrzeug?.opta.localCode ?? '',
            functionCode: editingFahrzeug?.opta.functionCode ?? '',
            orderNumber: editingFahrzeug?.opta.orderNumber ?? '',
          },
          iconDefinition: editingFahrzeug?.iconDefinition ?? {},
        }}
      >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource} // FIXME[ember-rescue-68](rubeen, 30.11.24): This must be fixed
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
        <OptaInputField
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
              dataIndex === 'kapazitaet' && {
                ...[
                  { type: 'number', required: true, message: 'Kapazität wird benötigt' },
                  { min: 0, message: 'Eine negative Stärke ist unzulässig.' },
                ],
              },
              dataIndex === 'fullOpta' && {
                required: true,
                message: 'Eine Opta wird benötigt',
              },
            ].filter((value) => !!value) as Rule[]
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
