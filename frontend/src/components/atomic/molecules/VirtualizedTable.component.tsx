import { flexRender, Table } from '@tanstack/react-table';
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';

interface VirtualizedTableProps<T> {
  table: Table<T>;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}

function VirtualizedTable<T>({ table, virtualizer }: VirtualizedTableProps<T>) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="divide-x divide-gray-200">
          {headerGroup.headers.map((header, idx) => (
            <th
              key={header.id}
              scope="col"
              className={clsx(
                'sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 px-4 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter',
                idx === 0 && 'sm:pl-6 lg:pl-8',
                idx === headerGroup.headers.length - 1 && 'sm:pr-6 lg:pr-8',
              )}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())
              }
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
      {virtualizer.getVirtualItems().map((virtualRow) => (
        <TableRow key={virtualRow.key} virtualRow={virtualRow} table={table} />
      ))}
      </tbody>
    </table>
  );
}

interface TableRowProps<T> {
  virtualRow: VirtualItem;
  table: Table<T>;
}

function TableRow<T>({ virtualRow, table }: TableRowProps<T>) {
  const row = table.getRowModel().rows[virtualRow.index];

  return (
    <tr
      className={clsx(
        virtualRow.index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
        'hover:bg-gray-100 transition-colors',
      )}
    >
      {row.getVisibleCells().map((cell, idx) => (
        <td
          key={cell.id}
          className={clsx(
            'whitespace-nowrap py-4 px-4 text-sm text-gray-500',
            idx === 0 && 'sm:pl-6 lg:pl-8',
            idx === row.getVisibleCells().length - 1 && 'sm:pr-6 lg:pr-8',
            (cell.column.columnDef.meta as any)?.['classNames'],
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default VirtualizedTable;