import {
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Button, Form, Switch as AntSwitch, Table, Tooltip } from 'antd';
import { Input, InputNumber, Select, Switch } from 'formik-antd';
import { useFahrzeuge } from '../../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { FahrzeugDto, FahrzeugTypDto } from '../../../../types/app/fahrzeug.types.js';
import { create } from 'zustand';
import { PiCheck, PiFingerprint, PiPencil, PiPlus, PiX } from 'react-icons/pi';
import type { AnyObject } from 'antd/es/_util/type.js';
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface.js';
import { Formik } from 'formik';
import { FormikProps } from 'formik/dist/types.js';
import { PatchFahrzeugType } from '../../../../services/backend/fahrzeuge.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import * as Yup from 'yup';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';

type EditingStore = {
  id: null | string;
  isEditing: (id: string) => boolean;
  setEditingId: (id: string) => void;
  resetEditingId: () => void;
};

const PatchFahrzeugSchema = Yup.object().shape({
  kapazitaet: Yup.number().required('Kapazitaet wird benötigt').min(0, 'Eine negative Stärke ist unzulässig.'),
  funkrufname: Yup.string().required('Ein Funkrufname wird benötigt'),
  fahrzeugTyp: Yup.string().required('Der Typ wird benötigt.'),
});

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
    case 'funkrufname':
      return 'text';
    case 'kapazitaet':
      return 'number';
    case 'istTemporaer':
      return 'checkbox';
  }
}

const newFahrzeugTemplate: FahrzeugDto = {
  funkrufname: '',
  istTemporaer: false,
  kapazitaet: 0,
  id: 'create.fahrzeug',
  fahrzeugTyp: { id: '', label: '' },
  _count: { einsatz_fahrzeug: 0 },
  status: { id: '', code: 'none', bezeichnung: '' },
};

type EditableFahrzeugType = Omit<PatchFahrzeugType, 'fahrzeugTypId'> & { fahrzeugTyp: string };

export function EditableFahrzeugeTable() {
  const [form] = Form.useForm();
  const { fahrzeuge, patchFahrzeuge, fahrzeugeTypen } = useFahrzeuge();
  const { isEditing, setEditingId, id, resetEditingId } = useEditingStore();
  const formRef = useRef<FormikProps<EditableFahrzeugType>>(null);

  const cancel = useCallback(resetEditingId, [resetEditingId]);

  const editingFahrzeug = useMemo(() => {
    if (newFahrzeugTemplate.id === id) {
      return newFahrzeugTemplate;
    }
    return fahrzeuge.data?.find((fahrzeug) => fahrzeug.id === id);
  }, [fahrzeuge.data, id]);

  const fahrzeugeTypItems = useMemo(() => {
    return (
      fahrzeugeTypen.data?.map(
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
    console.log('FahrzeugTyp', { typ: editingFahrzeug?.fahrzeugTyp });
    formRef.current?.setValues({
      id: editingFahrzeug?.id ?? '',
      kapazitaet: editingFahrzeug?.kapazitaet ?? 0,
      istTemporaer: editingFahrzeug?.istTemporaer ?? false,
      fahrzeugTyp: editingFahrzeug?.fahrzeugTyp.id ?? '',
      funkrufname: editingFahrzeug?.funkrufname ?? 'MHHHH',
    });
    setTimeout(() => {
      console.log('using form input', { editingFahrzeug, formValue: formRef.current?.values });
    }, 0);
  }, [editingFahrzeug]);

  const save = useCallback(() => {
    formRef.current?.submitForm().then(resetEditingId);
  }, [formRef.current, resetEditingId]);

  const columns = useMemo<EditableColumnsType<FahrzeugDto>>(
    () => [
      {
        title: 'Interne ID',
        dataIndex: 'id',
        editable: false,
        width: 100,
        render: (value) => {
          return (
            <Tooltip title={value} trigger={'click'}>
              <Button type="text" shape="circle">
                <PiFingerprint />
              </Button>
            </Tooltip>
          );
        },
      },
      { title: 'Funkrufname', dataIndex: 'funkrufname', editable: true },
      {
        title: 'Typ des Fahrzeugs',
        dataIndex: 'fahrzeugTyp',
        editable: true,
        render: (value: FahrzeugTypDto) => value.label,
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
                  <Button type="primary" onClick={save} icon={<PiCheck />} />
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
    [fahrzeuge.data],
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
          onCell: (record: FahrzeugDto) => ({
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
    () =>
      [id === newFahrzeugTemplate.id ? [newFahrzeugTemplate] : undefined, fahrzeuge.data]
        .filter((value) => value !== undefined)
        .flat(),
    [newFahrzeugTemplate, id, fahrzeuge.data],
  );
  return (
    <Formik<EditableFahrzeugType>
      validateOnChange={false}
      validationSchema={PatchFahrzeugSchema}
      onSubmit={(data) => {
        console.log('submitting with data', { data });
        patchFahrzeuge.mutate([{ ...data, fahrzeugTypId: data.fahrzeugTyp }]);
      }}
      initialValues={{
        id: editingFahrzeug?.id ?? '',
        funkrufname: editingFahrzeug?.funkrufname ?? '',
        fahrzeugTyp: editingFahrzeug?.fahrzeugTyp.id ?? '',
        istTemporaer: editingFahrzeug?.istTemporaer ?? false,
        kapazitaet: editingFahrzeug?.kapazitaet ?? 0,
      }}
      innerRef={formRef}
    >
      <Form form={form}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          loading={fahrzeuge.isLoading}
          // @ts-ignore
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            pageSize: 10,
            onChange: cancel,
          }}
        />
      </Form>
    </Formik>
  );
}

interface EditableCellProps<Item> extends HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'checkbox' | 'select';
  options?: DefaultOptionType[];
  record: Item;
  index: number;
}

function getMin(dataIndex: string) {
  if (dataIndex === 'kapazitaet') {
    return 0;
  }
}

function EditableCell<Item>({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  options,
  children,
  ...restProps
}: PropsWithChildren<EditableCellProps<Item>>): ReactNode {
  let inputNode: ReactElement;
  switch (inputType) {
    case 'number':
      inputNode = <InputNumber min={getMin(dataIndex)} name={dataIndex} />;
      break;
    case 'text':
      inputNode = <Input name={dataIndex} />;
      break;
    case 'checkbox':
      inputNode = <Switch name={dataIndex} />;
      break;
    case 'select':
      inputNode = (
        <Select
          name={dataIndex}
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
  }

  return (
    <td {...restProps}>
      {editing ? (
        <InputWrapper className="m-0" name={dataIndex}>
          {inputNode}
        </InputWrapper>
      ) : (
        children
      )}
    </td>
  );
}
