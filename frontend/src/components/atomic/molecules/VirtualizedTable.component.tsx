import { Cell, flexRender, Header, Row, Table } from '@tanstack/react-table';
import { Virtualizer } from '@tanstack/react-virtual';
import { cellStyles, rowStyles } from '../../../styles/table.styles.ts';


interface HeaderCellProps<T> {
  header: Header<T, unknown>;
  position: 'first' | 'middle' | 'last';
}

function HeaderCell<T>({ header, position }: HeaderCellProps<T>) {
  return (
    <th
      scope="col"
      className={cellStyles({ type: 'header', position })}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())
      }
    </th>
  );
}

interface BodyCellProps<T> {
  cell: Cell<T, unknown>;
  position: 'first' | 'middle' | 'last';
}

function BodyCell<T>({ cell, position }: BodyCellProps<T>) {
  return (
    <td
      className={cellStyles({
        type: 'body',
        position,
        className: (cell.column.columnDef.meta as any)?.['classNames'],
      })}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
}

interface TableRowProps<T> {
  row: Row<T>;
  table: Table<T>;
  index: number;
}

function TableRow<T>({ row, index }: TableRowProps<T>) {
  return (
    <tr className={rowStyles({ striped: index % 2 === 0 ? 'even' : 'odd' })}>
      {row.getVisibleCells().map((cell, cellIndex) => (
        <BodyCell
          key={cell.id}
          cell={cell}
          position={cellIndex === 0 ? 'first' : cellIndex === row.getVisibleCells().length - 1 ? 'last' : 'middle'}
        />
      ))}
    </tr>
  );
}

interface VirtualizedTableProps<T> {
  table: Table<T>;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
}

function VirtualizedTable<T>({ table, virtualizer }: VirtualizedTableProps<T>) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="divide-x divide-gray-200">
          {headerGroup.headers.map((header, index) => (
            <HeaderCell
              key={header.id}
              header={header}
              position={index === 0 ? 'first' : index === headerGroup.headers.length - 1 ? 'last' : 'middle'}
            />
          ))}
        </tr>
      ))}
      </thead>
      <tbody className="divide-y divide-gray-200">
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const row = table.getRowModel().rows[virtualRow.index];
        return (
          <TableRow
            key={row.id}
            row={row}
            table={table}
            index={virtualRow.index}
          />
        );
      })}
      </tbody>
    </table>
  );
}

export default VirtualizedTable;