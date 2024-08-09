import { useCallback, useMemo, useRef, useState } from 'react';
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { natoDateTime } from '../../../utils/time.js';
import VirtualizedTable from '../molecules/VirtualizedTable.component.js';
import { BadgeButton } from '../atoms/Badge.component.js';
import { EinsatztagebuchHeaderComponent } from '../molecules/EinsatztagebuchHeader.component.js';
import { EinsatztagebuchFormWrapperComponent } from '../molecules/EinsatztagebuchFormWrapper.component.js';
import { EinsatztagebuchEintrag } from '../../../types/app/einsatztagebuch.types.js';
import { useModal } from '../../../hooks/modal.hook.js';
import { PiGitPullRequest, PiPen } from 'react-icons/pi';
import { GenericForm } from './GenericForm.component.js';
import { z } from 'zod';
import { useEinheitenItems } from '../../../hooks/einheiten/einheiten-items.hook.js';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';

const columnHelper = createColumnHelper<EinsatztagebuchEintrag>();

export function EinsatztagebuchComponent() {
  const { einsatztagebuch, archiveEinsatztagebuchEintrag, createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const [inputVisible, setInputVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const { openModal, isOpen, closeModal } = useModal();
  const { einheiten } = useEinheiten();

  const { einheitenAsItems } = useEinheitenItems({
    include: ['einheitenImEinsatz', 'einheitenNichtImEinsatz'],
  });

  const modifyEntry = useCallback((entry: EinsatztagebuchEintrag) => {
    openModal({
      content: <GenericForm<EinsatztagebuchEintrag>
        defaultValues={{
          ...entry,
          absender: einheiten.data?.find(e => e.funkrufname === entry.absender)?.id ?? entry.absender,
          empfaenger: einheiten.data?.find(e => e.funkrufname === entry.empfaenger)?.id ?? entry.empfaenger,
        }}
        submitText="Eintrag ändern"
        submitIcon={PiGitPullRequest}
        onSubmit={async (data) => {
          await createEinsatztagebuchEintrag.mutateAsync({
            ...data,
            absender: einheiten.data?.find(e => e.id === data.absender)?.funkrufname ?? data.absender,
            empfaenger: einheiten.data?.find(e => e.id === data.empfaenger)?.funkrufname ?? data.empfaenger,
          });
          await archiveEinsatztagebuchEintrag.mutateAsync({ einsatztagebuchEintragId: entry.id });
          closeModal();
        }}
        sections={[
          {
            fields: [
              {
                name: 'absender', label: 'Absender', type: 'combo', placeholder: 'Empfänger des Eintrags', validators: {
                  onChange: z.string({ message: 'Ein Absender wird benötigt' }).min(0),
                },
                items: einheitenAsItems,
                width: 'half',
              },
              {
                name: 'empfaenger',
                label: 'Empfänger',
                type: 'combo',
                placeholder: 'Empfänger des Eintrags',
                validators: {
                  onChange: z.string({ message: 'Ein Empfänger wird benötigt' }).min(0),
                },
                items: einheitenAsItems,
                width: 'half',
              },
              {
                name: 'content', label: 'Inhalt', type: 'textarea', placeholder: 'Inhalt des Eintrags', validators: {
                  onChange: z.string().min(0, { message: 'Ein Inhalt wird für den Einsatztagebucheintrag benötigt' }),
                },
              },
            ],
          },
        ]}
      />,
      icon: PiPen,
      fullWidth: false,
      panelColor: 'primary',
      title: `Eintrag von ${format(entry.timestamp, natoDateTime)} bearbeiten`,
      variant: 'panel',
    });
  }, [openModal]);

  const columns = useMemo<ColumnDef<EinsatztagebuchEintrag, any>[]>(() => [
    columnHelper.accessor('timestamp', {
      header: 'Zeitpunkt',
      cell: ({ getValue, row }) => {
        const valueAsNato = format(getValue(), natoDateTime);
        const createdAsNato = format(row.original.createdAt, natoDateTime);
        const updatedAsNato = format(row.original.updatedAt, natoDateTime);
        return (
          <div className="grid grid-cols-2 overflow-hidden w-24">
            <span className="col-span-2 text-right block">{valueAsNato}</span>
            {createdAsNato !== valueAsNato && (<>
                <span className="block text-gray-400 dark:text-gray-600 text-xs">erstellt:</span>
                <span className="block text-gray-400 dark:text-gray-600 text-xs text-right">{createdAsNato}</span>
              </>
            )}
            {row.original.archived && (<>
                <span className="block text-red-400 dark:text-red-600 text-xs">gelöscht:</span>
                <span
                  className="block text-red-400 dark:text-red-600 text-xs text-right">{updatedAsNato}</span>
              </>
            )}
          </div>
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
          row.original.type !== 'USER' && 'text-gray-400 dark:text-gray-600',
          row.original.archived && 'line-through decoration-red-500/75 text-gray-400 dark:text-gray-600',
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
                           onClick={() => !isOpen && modifyEntry(row.original)}>
                Eintrag überschreiben
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