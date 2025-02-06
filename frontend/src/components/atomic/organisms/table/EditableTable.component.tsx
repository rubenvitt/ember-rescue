import type { TableProps } from 'antd';
import { Table, Typography } from 'antd';
import { ReactNode } from 'react';

export type EditableColumnsType<RecordType> = TableProps<RecordType>['columns'];

interface EditableTableProps<T> {
    title: string;
    dataSource: T[];
    columns: EditableColumnsType<T>;
    loading?: boolean;
    extraComponent?: ReactNode;
}

export function EditableTable<T extends { id: string }>({
    title,
    dataSource,
    columns,
    loading,
    extraComponent
}: EditableTableProps<T>) {
    return (
        <>
            <Typography.Title level={3}>{title}</Typography.Title>
            <Table<T>
                bordered
                dataSource={dataSource}
                loading={loading}
                columns={columns}
                pagination={{
                    pageSize: 10,
                }}
            />
            {extraComponent}
        </>
    );
} 