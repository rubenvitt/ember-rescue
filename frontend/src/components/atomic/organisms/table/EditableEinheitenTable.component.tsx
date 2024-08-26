import { HTMLAttributes, PropsWithChildren, ReactNode, useCallback, useMemo } from 'react';
import { Button, Form, Input, InputNumber, Switch, Table } from 'antd';
import { useFormikContext } from 'formik';
import { useEinheiten } from '../../../../hooks/einheiten/einheiten.hook.js';
import { EinheitDto, EinheitTypDto } from '../../../../types/app/einheit.types.js';
import { create } from 'zustand';
import { PiDoor, PiPencil } from 'react-icons/pi';
import type { AnyObject } from 'antd/es/_util/type.js';
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface.js';

type EditingStore = {
  id: null | string;
  isEditing: (id: string) => boolean
  setEditingId: (id: string) => void;
  resetEditingId: () => void;
}

const useEditingStore = create<EditingStore>((setState, getState, store) => ({
  id: null,
  isEditing(id: string) {
    return getState().id === id;
  },
  setEditingId: (id: string) => setState({ id }),
  resetEditingId: () => setState({ id: null }),
}));

type EditableColumnsType<RecordType = AnyObject> = ((ColumnGroupType<RecordType> | ColumnType<RecordType>) & {
  editable?: boolean,
  dataIndex?: string,
})[];

function selectInputType(dataIndex?: string) {
  switch (dataIndex) {
    case 'einheitTyp':
    case 'funkrufname':
      return 'text';
    case 'kapazitaet':
      return 'number';
    case 'istTemporaer':
      return 'checkbox';
  }
}

export function EditableEinheitenTable() {
  const formikContext = useFormikContext();
  const [form] = Form.useForm();
  const { einheiten } = useEinheiten();
  const { isEditing, setEditingId, id, resetEditingId } = useEditingStore();

  const cancel = useCallback(resetEditingId, [resetEditingId]);

  const columns = useMemo<EditableColumnsType<EinheitDto>>(() => ([
    { title: 'Interne ID', dataIndex: 'id', editable: false, width: 10 },
    { title: 'Art', dataIndex: 'einheitTyp', editable: true, render: (value: EinheitTypDto) => value.label },
    { title: 'Kapazität', dataIndex: 'kapazitaet', editable: true },
    {
      title: 'Temporär',
      dataIndex: 'istTemporaer',
      editable: true,
      render: (value, record) => <Switch value={value} disabled={true} />,
    },
    { title: 'Test', dataIndex: 'funkrufname', editable: true },
    {
      title: 'Todo', dataIndex: 'actions',
      render: ((_, record) => {
        const editing = isEditing(record.id);
        if (editing) {
          return <Button type="primary" onClick={cancel} icon={<PiDoor />} />;
        }
        return <Button type="text" icon={<PiPencil />} onClick={() => {
          form.setFieldsValue(record);
          setEditingId(record.id);
        }} />;
      }),
    },
  ]), [einheiten.data]);

  const mergedColumns = useMemo(() => columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: EinheitDto) => ({
        record,
        inputType: selectInputType(col.dataIndex),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record.id),
      }),
    };
  }), [columns, isEditing]);

  return <Form form={form}>
    <p>{id}</p>
    <Table
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      bordered
      dataSource={einheiten.data}
      loading={einheiten.isLoading}
      columns={mergedColumns}
      rowClassName="editable-row"
      pagination={{
        onChange: cancel,
      }}
    />
  </Form>;
}

interface EditableCellProps<Item> extends HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'checkbox';
  record: Item;
  index: number;
}

function EditableCell<Item>({
                              editing,
                              dataIndex,
                              title,
                              inputType,
                              record,
                              index,
                              children,
                              ...restProps
                            }: PropsWithChildren<EditableCellProps<Item>>): ReactNode {
  const inputNode = inputType === 'number' ? <InputNumber /> : (inputType === 'checkbox' ? <Switch /> : <Input />);

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `${title} wird benötigt`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}
