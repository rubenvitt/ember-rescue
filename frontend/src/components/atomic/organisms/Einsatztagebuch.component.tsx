import { useMemo, useRef, useState } from 'react';
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { invoke } from '@tauri-apps/api/core';
import { twMerge } from 'tailwind-merge';

import { EinsatztagebuchEintrag } from '../../../types/types.js';
import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { natoDateTime } from '../../../utils/time.js';
import VirtualizedTable from '../molecules/VirtualizedTable.component.js';
import { BadgeButton } from '../atoms/Badge.component.js';
import { EinsatztagebuchHeaderComponent } from '../molecules/EinsatztagebuchHeader.component.js';
import { EinsatztagebuchFormWrapperComponent } from '../molecules/EinsatztagebuchFormWrapper.component.js';

const columnHelper = createColumnHelper<EinsatztagebuchEintrag>();

export function EinsatztagebuchComponent() {
  const { einsatztagebuch, archiveEinsatztagebuchEintrag } = useEinsatztagebuch();
  const [inputVisible, setInputVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<EinsatztagebuchEintrag, any>[]>(() => [
    columnHelper.accessor('timestamp', {
      header: 'Zeitpunkt',
      cell: ({ getValue, row }) => {
        const valueAsNato = format(getValue(), natoDateTime);
        const createdAsNato = format(row.original.createdAt, natoDateTime);
        return (
          <span className="block">
            {valueAsNato}
            {createdAsNato !== valueAsNato && (
              <span className="block text-gray-400 text-xs">(erstellt: {createdAsNato})</span>
            )}
          </span>
        );
      },
    }),
    columnHelper.accessor('absender', {
      header: 'Absender',
      cell: ({ getValue }) => getValue(),
      enableGrouping: true,
    }),
    columnHelper.accessor('empfaenger', {
      header: 'Empfänger',
      cell: ({ getValue }) => getValue(),
      enableGrouping: true,
    }),
    columnHelper.accessor('content', {
      header: 'Inhalt',
      meta: { classNames: 'text-gray-900 dark:text-white' },
      cell: ({ getValue, row }) => (
        <span className={twMerge(
          row.original.type !== 'USER' && 'text-gray-400',
          row.original.archived && 'line-through decoration-red-500/75',
        )}>
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Typ',
      cell: ({ getValue }) => getValue(),
      enableGlobalFilter: true,
    }),
    columnHelper.display({
      header: 'Aktionen',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {!row.original.archived && (
            <>
              <BadgeButton color="orange"
                           onClick={() => invoke('log_message', { message: `clicked ${row.original.id}` })}>
                Bearbeiten
              </BadgeButton>
              <BadgeButton color="red"
                           onClick={() => archiveEinsatztagebuchEintrag.mutate({ einsatztagebuchEintragId: row.original.id })}>
                Löschen
              </BadgeButton>
            </>
          )}
        </div>
      ),
      enableGrouping: true,
    }),
  ], [archiveEinsatztagebuchEintrag]);

  const table = useReactTable({
    data: einsatztagebuch ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const virtualizer = useVirtualizer({
    count: einsatztagebuch?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 34,
    overscan: 150,
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <EinsatztagebuchHeaderComponent inputVisible={inputVisible} setInputVisible={setInputVisible} />
      <EinsatztagebuchFormWrapperComponent inputVisible={inputVisible} closeForm={() => setInputVisible(false)} />
      <div ref={parentRef} className="mt-8 flow-root" style={{ height: '800px', overflow: 'auto' }}>
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <VirtualizedTable table={table} virtualizer={virtualizer} />
          </div>
        </div>
      </div>
    </div>
  );
}