import { EinsatztagebuchEintrag } from '../../../types.js';
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { natoDateTime } from '../../../lib/time.js';
import { useRef, useState } from 'react';
import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { BadgeButton } from '../../catalyst-components/badge.js';
import { invoke } from '@tauri-apps/api/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import VirtualizedTable from '../molecules/VirtualizedTable.component.js';
import { Button } from '../../catalyst-components/button.js';

const columnHelper = createColumnHelper<EinsatztagebuchEintrag>();
const columns: ColumnDef<EinsatztagebuchEintrag, any>[] = [
  columnHelper.accessor('timestamp', {
    header: 'Zeitpunkt',
    cell: (context) => format(context.getValue(), natoDateTime),
  }),
  columnHelper.accessor('absender', {
    header: 'Absender',
    cell: (context) => context.getValue(),
    enableGrouping: true,
  }),
  columnHelper.accessor('empfaenger', {
    header: 'Empfänger',
    cell: (context) => context.getValue(),
    enableGrouping: true,
  }),
  columnHelper.accessor('content', {
    header: 'Inhalt',
    meta: { classNames: 'text-gray-900' },
    cell: (context) => {
      return context.getValue();
    },
  }),
  columnHelper.accessor('type', {
    header: 'Typ',
    cell: (context) => context.getValue(),
  }),
  columnHelper.display({
    header: 'Aktionen',
    cell: (context) => {
      let contextId = context.row.original.id;
      return (<div className="flex gap-2">
          <BadgeButton color="orange" onClick={() => invoke('log_message', { message: `clicked ${contextId}` })}>
            Bearbeiten
          </BadgeButton>
          <BadgeButton color="red" onClick={() => invoke('log_message', { message: `clicked ${contextId}` })}>
            Löschen
          </BadgeButton>
        </div>
      );
    },
    enableGrouping: true,
  }),
];

export function EinsatztagebuchComponent() {
  const { einsatztagebuch, createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const [inputVisible, setInputVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

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
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Einträge im ETB</h1>
          <p className="mt-2 text-sm text-gray-700">
            Hier sollte vielleicht ein Inputfeld für das Anlegen neuer Einträge stehen und zusätzlich eine
            Filter- und Suchmöglichkeit für die Einträge.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setInputVisible(true)}
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Eintrag anlegen
          </button>
        </div>
      </div>
      {inputVisible && (
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="absender" className="block text-sm font-semibold text-gray-700">Absender</label>
              <input
                type="text"
                id="absender"
                name="absender"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="empfaenger" className="block text-sm font-semibold text-gray-700">Empfänger</label>
              <input
                type="text"
                id="empfaenger"
                name="empfaenger"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700">Inhalt</label>
              <textarea
                id="content"
                name="content"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <Button className="cursor-pointer" onClick={async () => {
                setInputVisible(false);
                await createEinsatztagebuchEintrag();
              }} color="blue">Eintrag anlegen</Button>
            </div>
          </div>
        </div>
      )}
      <div ref={parentRef} className="mt-8 flow-root" style={{
        height: '800px',
        overflow: 'auto',
      }}>
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <VirtualizedTable table={table} virtualizer={virtualizer} />
          </div>
        </div>
      </div>
    </div>
  );
}
