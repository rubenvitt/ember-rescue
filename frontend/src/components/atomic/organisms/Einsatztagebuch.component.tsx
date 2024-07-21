import { EinsatztagebuchEintrag } from '../../../types/types.js';
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useRef, useState } from 'react';
import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { useVirtualizer } from '@tanstack/react-virtual';
import VirtualizedTable from '../molecules/VirtualizedTable.component.js';
import { EinsatztagebuchForm } from '../molecules/EinsatztagebuchForm.component.js';
import { Button } from '../../deprecated/button.js';
import { Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { natoDateTime } from '../../../utils/time.js';
import { clsx } from 'clsx';
import { BadgeButton } from '../../deprecated/badge.js';
import { invoke } from '@tauri-apps/api/core';

const columnHelper = createColumnHelper<EinsatztagebuchEintrag>();

export function EinsatztagebuchComponent() {
  const { einsatztagebuch, archiveEinsatztagebuchEintrag } = useEinsatztagebuch();
  const [inputVisible, setInputVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<EinsatztagebuchEintrag, any>[]>(() => {
    return [
      columnHelper.accessor('timestamp', {
        header: 'Zeitpunkt',
        cell: (context) => {
          const valueAsNato = format(context.getValue(), natoDateTime);
          const createdAsNato = format(context.row.original.createdAt, natoDateTime);
          return <span className="block">{valueAsNato} {
            (createdAsNato !== valueAsNato)
              ?
              <span className="block text-gray-400 text-xs">(erstellt: {createdAsNato})</span>
              : ''
          }</span>;
        },
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
        meta: { classNames: 'text-gray-900 dark:text-white' },
        cell: (context) => {
          const eintrag = context.row.original;
          return <span
            className={clsx(eintrag.type !== 'USER' && 'text-gray-400', eintrag.archived && 'line-through decoration-red-500/75')}>{context.getValue()}</span>;
        },
      }),
      columnHelper.accessor('type', {
        header: 'Typ',
        cell: (context) => context.getValue(),
        enableGlobalFilter: true,
      }),
      columnHelper.display({
        header: 'Aktionen',
        cell: (context) => {
          let eintrag = context.row.original;
          return (<div className="flex gap-2">
              {!eintrag.archived &&
                <>
                  <BadgeButton color="orange"
                               onClick={() => invoke('log_message', { message: `clicked ${eintrag.id}` })}>
                    Bearbeiten
                  </BadgeButton>
                  <BadgeButton color="red"
                               onClick={() => archiveEinsatztagebuchEintrag.mutate({ einsatztagebuchEintragId: eintrag.id })}>
                    Löschen
                  </BadgeButton>
                </>
              }
            </div>
          );
        },
        enableGrouping: true,
      }),
    ];
  }, []);

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
          <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Einträge im ETB</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Hier sollte vielleicht ein Inputfeld für das Anlegen neuer Einträge stehen und zusätzlich eine
            Filter- und Suchmöglichkeit für die Einträge.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            color={inputVisible ? 'red' : 'primary'}
            onClick={() => setInputVisible(((prev) => !prev))}
            type="button"
            className="cursor-pointer"
          >
            {inputVisible ? 'Abbrechen' : 'Eintrag anlegen'}
          </Button>
        </div>
      </div>
      <Transition show={inputVisible}>
        <div className="mt-4 transition duration-50 ease-in data-[closed]:opacity-0 max-w-4xl">
          <EinsatztagebuchForm closeForm={() => setInputVisible(false)} />
        </div>
      </Transition>
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
