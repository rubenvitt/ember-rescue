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
import { useEinheiten } from '../../../../hooks/einheiten/einheiten.hook.js';
import { EinheitDto, EinheitTypDto } from '../../../../types/app/einheit.types.js';
import { create } from 'zustand';
import { PiCheck, PiFingerprint, PiPencil, PiPlus, PiX } from 'react-icons/pi';
import type { AnyObject } from 'antd/es/_util/type.js';
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface.js';
import { Formik } from 'formik';
import { FormikProps } from 'formik/dist/types.js';
import { PatchEinheitType } from '../../../../services/backend/einheiten.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import * as Yup from 'yup';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';

type EditingStore = {
  id: null | string;
  isEditing: (id: string) => boolean;
  setEditingId: (id: string) => void;
  resetEditingId: () => void;
};

const PatchEinheitSchema = Yup.object().shape({
  kapazitaet: Yup.number().required('Kapazitaet wird benötigt').min(0, 'Eine negative Stärke ist unzulässig.'),
  funkrufname: Yup.string().required('Ein Funkrufname wird benötigt'),
  einheitTyp: Yup.string().required('Der Typ wird benötigt.'),
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
    case 'einheitTyp':
      return 'select';
    case 'funkrufname':
      return 'text';
    case 'kapazitaet':
      return 'number';
    case 'istTemporaer':
      return 'checkbox';
  }
}

const newEinheitTemplate: EinheitDto = {
  funkrufname: '',
  istTemporaer: false,
  kapazitaet: 0,
  id: 'create.einheit',
  einheitTyp: { id: '', label: '' },
  _count: { einsatz_einheit: 0 },
  status: { id: '', code: 'none', bezeichnung: '' },
};

type EditableEinheitType = Omit<PatchEinheitType, 'einheitTypId'> & { einheitTyp: string };

export function EditableEinheitenTable() {
  const [form] = Form.useForm();
  const { einheiten, patchEinheiten, einheitenTypen } = useEinheiten();
  const { isEditing, setEditingId, id, resetEditingId } = useEditingStore();
  const formRef = useRef<FormikProps<EditableEinheitType>>(null);

  const cancel = useCallback(resetEditingId, [resetEditingId]);

  const editingEinheit = useMemo(() => {
    if (newEinheitTemplate.id === id) {
      return newEinheitTemplate;
    }
    return einheiten.data?.find((einheit) => einheit.id === id);
  }, [einheiten.data, id]);

  const einheitenTypItems = useMemo(() => {
    return (
      einheitenTypen.data?.map(
        (einheitTyp) =>
          ({
            value: einheitTyp.id,
            search: [einheitTyp.label, einheitTyp.description].join(' '),
            label: (
              <div className="flex justify-between">
                <span>{einheitTyp.label}</span>
                <span>{einheitTyp.description}</span>
              </div>
            ),
          }) satisfies DefaultOptionType,
      ) ?? []
    );
  }, [einheitenTypen.data]);

  function selectOptions(dataIndex?: string) {
    switch (dataIndex) {
      case 'einheitTyp':
        return einheitenTypItems;
      default:
        return undefined;
    }
  }

  useEffect(() => {
    console.log('EinheitTyp', { typ: editingEinheit?.einheitTyp });
    formRef.current?.setValues({
      id: editingEinheit?.id ?? '',
      kapazitaet: editingEinheit?.kapazitaet ?? 0,
      istTemporaer: editingEinheit?.istTemporaer ?? false,
      einheitTyp: editingEinheit?.einheitTyp.id ?? '',
      funkrufname: editingEinheit?.funkrufname ?? 'MHHHH',
    });
    setTimeout(() => {
      console.log('using form input', { editingEinheit, formValue: formRef.current?.values });
    }, 0);
  }, [editingEinheit]);

  const save = useCallback(() => {
    formRef.current?.submitForm().then(resetEditingId);
  }, [formRef.current, resetEditingId]);

  const columns = useMemo<EditableColumnsType<EinheitDto>>(
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
        title: 'Typ der Einheit',
        dataIndex: 'einheitTyp',
        editable: true,
        render: (value: EinheitTypDto) => value.label,
      },
      { title: 'Standard-Stärke', dataIndex: 'kapazitaet', editable: true },
      {
        title: 'Temporär',
        dataIndex: 'istTemporaer',
        editable: true,
        render: (value) => <AntSwitch value={value} disabled={true} />,
      },
      {
        title: (
          <div className="flex justify-center">
            <Tooltip title="Neue Einheit hinzufügen">
              <Button icon={<PiPlus />} onClick={() => setEditingId('create.einheit')} />
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
    [einheiten.data],
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
          onCell: (record: EinheitDto) => ({
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
      [id === newEinheitTemplate.id ? [newEinheitTemplate] : undefined, einheiten.data]
        .filter((value) => value !== undefined)
        .flat(),
    [newEinheitTemplate, id, einheiten.data],
  );
  return (
    <Formik<EditableEinheitType>
      validateOnChange={false}
      validationSchema={PatchEinheitSchema}
      onSubmit={(data) => {
        console.log('submitting with data', { data });
        patchEinheiten.mutate([{ ...data, einheitTypId: data.einheitTyp }]);
      }}
      initialValues={{
        id: editingEinheit?.id ?? '',
        funkrufname: editingEinheit?.funkrufname ?? '',
        einheitTyp: editingEinheit?.einheitTyp.id ?? '',
        istTemporaer: editingEinheit?.istTemporaer ?? false,
        kapazitaet: editingEinheit?.kapazitaet ?? 0,
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
          loading={einheiten.isLoading}
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
