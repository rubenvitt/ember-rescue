import { EinsatztagebuchEintrag } from '../../../types.js';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { natoDateTime } from '../../../lib/time.js';
import clsx from 'clsx';
import { useState } from 'react';
import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { BadgeButton } from '../../catalyst-components/badge.js';
import { invoke } from '@tauri-apps/api/core';

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
      return (<>
          <BadgeButton color="orange" onClick={() => invoke('log_message', { message: `clicked ${contextId}` })}>
            Bearbeiten
          </BadgeButton>
          <BadgeButton color="red" onClick={() => invoke('log_message', { message: `clicked ${contextId}` })}>
            Löschen
          </BadgeButton>
        </>
      );
    },
    enableGrouping: true,
  }),
];

export function EinsatztagebuchComponent() {
  //remodel entries using useReducer
  const { einsatztagebuch, createEinsatztagebuchEintrag } = useEinsatztagebuch();

  const table = useReactTable<EinsatztagebuchEintrag>({
    data: einsatztagebuch ?? [], columns, getCoreRowModel: getCoreRowModel(),
  });

  const [inputVisible, setInputVisible] = useState(false);

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
              <button
                onClick={async () => {
                  setInputVisible(false);
                  await createEinsatztagebuchEintrag();
                }}
                type="button"
                className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Eintrag anlegen
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="divide-x divide-gray-200">
                  {headerGroup.headers.map((header, idx) => (
                    <th key={header.id} id={header.id} scope="col"
                        className={clsx(
                          'px-4 text-left text-sm font-semibold text-gray-900',
                          idx === 0 && 'py-3.5 sm:pl-0',
                          idx > 0 && idx < headerGroup.headers.length - 1 && 'py-3.5',
                          idx === headerGroup.headers.length - 1 && 'pl-4 sm:pr-0',
                        )}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </th>
                  ))}
                </tr>
              ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, idx) => (
                    <td key={cell.id} className={clsx(
                      'whitespace-nowrap p-4 text-sm text-gray-500',
                      idx === 0 && 'sm:pl-0',
                      idx > 0 && idx < row.getVisibleCells.length - 1 && '',
                      idx === row.getVisibleCells.length - 1 && 'sm:pr-0',
                      (cell.column.columnDef.meta as any)?.['classNames'],
                    )}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
              <tfoot>
              {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                    </th>
                  ))}
                </tr>
              ))}
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
