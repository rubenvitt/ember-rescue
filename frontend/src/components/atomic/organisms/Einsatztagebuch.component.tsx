import { useCallback, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { natoDateTime } from '../../../utils/time.js';
import { EinsatztagebuchHeaderComponent } from '../molecules/EinsatztagebuchHeader.component.js';
import { EinsatztagebuchFormWrapperComponent } from '../molecules/EinsatztagebuchFormWrapper.component.js';
import { EinsatztagebuchEintrag } from '../../../types/app/einsatztagebuch.types.js';
import { PiEmpty, PiSwap, PiTextStrikethrough } from 'react-icons/pi';
import { useEinheitenItems } from '../../../hooks/einheiten/einheiten-items.hook.js';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { Button, Drawer, Empty, Table, TableColumnsType, Tooltip } from 'antd';
import { FormLayout } from './form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { Input, Select } from 'formik-antd';

export function EinsatztagebuchComponent() {
  const { einsatztagebuch, archiveEinsatztagebuchEintrag, createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const [inputVisible, setInputVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEintrag, setEditingEintrag] = useState<EinsatztagebuchEintrag | null>(null);
  const { einheiten } = useEinheiten();
  const onDrawerClose = useCallback(() => {
    setEditingEintrag(null);
    setIsOpen(false);
  }, []);

  const { einheitenAsItems } = useEinheitenItems({
    include: ['einheitenImEinsatz', 'einheitenNichtImEinsatz'],
  });

  const modifyEntry = useCallback((entry: EinsatztagebuchEintrag) => {
    setIsOpen(true);
    setEditingEintrag(entry);
  }, []);

  const columns = useMemo<TableColumnsType<EinsatztagebuchEintrag>>(() => {
    return [
      {
        title: '#', dataIndex: 'fortlaufende_nummer', key: 'fortlaufende_nummer', fixed: true,
        width: 80,
      },
      {
        title: 'Zeitpunkt', key: 'timestamp', width: 200, render: (_, record) => {
          const timestampAsNato = format(record.timestamp, natoDateTime);
          const createdAsNato = format(record.createdAt, natoDateTime);
          const updatedAsNato = format(record.updatedAt, natoDateTime);
          return (
            <>
              <span>{timestampAsNato}</span>
              {createdAsNato !== timestampAsNato && (<>
                  <span className="block text-gray-400 dark:text-gray-600 text-xs">erstellt: {createdAsNato}</span>
                </>
              )}
              {record.archived && (<>
                  <span className="block text-red-400 dark:text-red-600 text-xs">gelöscht: {updatedAsNato}</span>
                </>
              )}
            </>
          );
        },
      },
      { title: 'Absender', dataIndex: 'absender', key: 'absender', width: 100 },
      { title: 'Empfänger', dataIndex: 'empfaenger', key: 'empfaenger', width: 120 },
      {
        title: 'Inhalt',
        dataIndex: 'content',
        key: 'content',
        width: 500,
        render: (value, record) => <span className={twMerge(
          record.type !== 'USER' && 'text-gray-400 dark:text-gray-600',
          record.archived && 'line-through decoration-red-500/75 text-gray-400 dark:text-gray-600',
        )}>
          {value}
        </span>,
      },
      { title: 'Typ', dataIndex: 'type', key: 'type', width: 100 },
      {
        render: (_, record) => <div className="flex gap-2">
          {!record.archived && (
            <>
              <Tooltip title="Eintrag überschreiben">
                <Button onClick={() => !isOpen && modifyEntry(record)} type="dashed" shape="circle"
                        icon={<PiSwap />} />
              </Tooltip>
              <Tooltip title="Eintrag streichen">
                <Button
                  onClick={() => archiveEinsatztagebuchEintrag.mutate({ einsatztagebuchEintragId: record.id })}
                  type="default" danger shape="circle" icon={<PiTextStrikethrough />} />
              </Tooltip>
            </>
          )}
        </div>,
        dataIndex: 'id', width: 150,
      },
    ];
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <EinsatztagebuchHeaderComponent inputVisible={inputVisible} setInputVisible={setInputVisible} />
      <EinsatztagebuchFormWrapperComponent inputVisible={inputVisible} closeForm={() => setInputVisible(false)} />
      <div ref={parentRef} className="mt-8">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="w-full py-2 align-middle sm:px-6 lg:px-8">
            <Table dataSource={einsatztagebuch} columns={columns} virtual scroll={{ x: true }}
                   pagination={false}
                   locale={{
                     emptyText: <Empty image={<PiEmpty size={48} />} description="Keine Einträge verfügbar" />,
                   }} />
          </div>
        </div>
      </div>
      <Drawer open={isOpen} onClose={onDrawerClose} title={editingEintrag && `Eintrag von ${format(editingEintrag.timestamp, natoDateTime)} bearbeiten`}>
        {editingEintrag && <FormLayout<EinsatztagebuchEintrag> formik={{
          initialValues: {
            ...editingEintrag,
            absender: einheiten.data?.find(e => e.funkrufname === editingEintrag.absender)?.id ?? editingEintrag.absender,
            empfaenger: einheiten.data?.find(e => e.funkrufname === editingEintrag.empfaenger)?.id ?? editingEintrag.empfaenger,
          },
          onSubmit: async (data) => {
            await createEinsatztagebuchEintrag.mutateAsync({
              ...data,
              absender: einheiten.data?.find(e => e.id === data.absender)?.funkrufname ?? data.absender,
              empfaenger: einheiten.data?.find(e => e.id === data.empfaenger)?.funkrufname ?? data.empfaenger,
            });
            await archiveEinsatztagebuchEintrag.mutateAsync({ einsatztagebuchEintragId: editingEintrag?.id });
            setIsOpen(false);
            setEditingEintrag(null);
          },
        }}>
          <InputWrapper label="Absender" name="absender">
            <Select name="absender" />
          </InputWrapper>
          <InputWrapper label="Empfänger" name="empfaenger">
            <Select name="empfaenger" />
          </InputWrapper>
          <InputWrapper label="Notiz" name="content">
            <Input.TextArea name="content" rows={5} />
          </InputWrapper>
        </FormLayout>
          // <GenericForm<EinsatztagebuchEintrag>
          //   defaultValues={{
          //     ...editingEintrag,
          //     absender: einheiten.data?.find(e => e.funkrufname === editingEintrag.absender)?.id ?? editingEintrag.absender,
          //     empfaenger: einheiten.data?.find(e => e.funkrufname === editingEintrag.empfaenger)?.id ?? editingEintrag.empfaenger,
          //   }}
          //   submitText="Eintrag ändern"
          //   submitIcon={PiGitPullRequest}
          //   sections={[
          //     {
          //       fields: [
          //         {
          //           name: 'absender',
          //           label: 'Absender',
          //           type: 'combo',
          //           placeholder: 'Empfänger des Eintrags',
          //           validators: {
          //             onChange: z.string({ message: 'Ein Absender wird benötigt' }).min(0),
          //           },
          //           items: einheitenAsItems,
          //           width: 'half',
          //         },
          //         {
          //           name: 'empfaenger',
          //           label: 'Empfänger',
          //           type: 'combo',
          //           placeholder: 'Empfänger des Eintrags',
          //           validators: {
          //             onChange: z.string({ message: 'Ein Empfänger wird benötigt' }).min(0),
          //           },
          //           items: einheitenAsItems,
          //           width: 'half',
          //         },
          //         {
          //           name: 'content',
          //           label: 'Inhalt',
          //           type: 'textarea',
          //           placeholder: 'Inhalt des Eintrags',
          //           validators: {
          //             onChange: z.string().min(0, { message: 'Ein Inhalt wird für den Einsatztagebucheintrag benötigt' }),
          //           },
          //         },
          //       ],
          //     },
          //   ]}
          // />
        }
      </Drawer>
    </div>
  );
}