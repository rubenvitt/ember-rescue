import { useCallback, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { natoDateTime } from '../../../utils/time.js';
import { EinsatztagebuchHeaderComponent } from '../molecules/EinsatztagebuchHeader.component.js';
import { EinsatztagebuchFormWrapperComponent } from '../molecules/EinsatztagebuchFormWrapper.component.js';
import { PiEmpty, PiMagnifyingGlass, PiSwap, PiTextStrikethrough } from 'react-icons/pi';
import { useFahrzeuge } from '../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { Button, Drawer, Empty, Input as AntInput, InputRef, Space, Table, TableColumnsType, TableColumnType, Tooltip } from 'antd';
import { FormLayout } from './form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { Input, Select } from 'formik-antd';
import dayjs from 'dayjs';
import { JournalEntryDto } from '@bluelight-hub/shared/client/index.js';

export function EinsatztagebuchComponent() {
  const { einsatztagebuch, archiveEinsatztagebuchEintrag, createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const [inputVisible, setInputVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEintrag, setEditingEintrag] = useState<JournalEntryDto | null>(null);
  const { fahrzeuge } = useFahrzeuge();
  const onDrawerClose = useCallback(() => {
    setEditingEintrag(null);
    setIsOpen(false);
  }, []);

  const searchInput = useRef<InputRef>(null);

  const getColumnSearchProps = (dataIndex: keyof JournalEntryDto): TableColumnType<JournalEntryDto> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <AntInput
          ref={searchInput}
          placeholder={`Inhalt suchen`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => confirm()} icon={<PiMagnifyingGlass />} size="small" style={{ width: 90 }}>
            Filtern
          </Button>
          <Button type="link" size="small" onClick={close}>
            Abbrechen
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <PiMagnifyingGlass style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) ?? false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const modifyEntry = useCallback((entry: JournalEntryDto) => {
    setIsOpen(true);
    setEditingEintrag(entry);
  }, []);

  const columns = useMemo<TableColumnsType<JournalEntryDto>>(() => {
    const fahrzeugTypen = (fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []).reduce(
      (acc, e) => {
        if (!e.optaFunktion) {
          return acc;
        }
        if (!acc[e.optaFunktion]) {
          acc[e.optaFunktion] = [];
        }
        acc[e.optaFunktion].push({ text: e.fullOpta, value: e.fullOpta });
        return acc;
      },
      {} as Record<string, { text: string; value: string }[]>,
    );
    const rufnahmeFilter = fahrzeugTypen
      ? Object.entries(fahrzeugTypen).map(([key, value]) => ({
          text: key,
          value: key,
          children: value,
        }))
      : [];

    return [
      {
        title: '#',
        dataIndex: 'nummer',
        key: 'nummer',
        fixed: true,
        width: 80,
        sorter: (a, b) => a.nummer - b.nummer,
      },
      {
        title: 'Zeitpunkt',
        key: 'timestamp',
        width: 200,
        render: (_, record) => {
          const timestampAsNato = format(record.timestamp, natoDateTime);
          const createdAsNato = format(record.createdAt, natoDateTime);
          const updatedAsNato = format(record.updatedAt, natoDateTime);
          return (
            <>
              <span>{timestampAsNato}</span>
              {createdAsNato !== timestampAsNato && (
                <>
                  <span className="block text-xs text-gray-400 dark:text-gray-200/65">erstellt: {createdAsNato}</span>
                </>
              )}
              {record.archived && (
                <>
                  <span className="block text-xs text-red-400 dark:text-red-600">gelöscht: {updatedAsNato}</span>
                </>
              )}
            </>
          );
        },
        sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      },
      {
        title: 'Absender',
        dataIndex: 'sender',
        key: 'sender',
        width: 100,
        filters: rufnahmeFilter,
        onFilter: (value, record) => record.sender === value,
        filterMultiple: true,
        filterSearch: true,
        filterMode: 'tree',
      },
      {
        title: 'Empfänger',
        dataIndex: 'receiver',
        key: 'receiver',
        width: 120,
        filters: rufnahmeFilter,
        onFilter: (value, record) => record.receiver === value,
        filterMultiple: true,
        filterSearch: true,
        filterMode: 'tree',
      },
      {
        title: 'Inhalt',
        dataIndex: 'content',
        key: 'content',
        width: 500,
        render: (value, record) => (
          <span className={twMerge(record.type !== 'USER' && 'text-gray-400 dark:text-gray-200/65', record.archived && 'text-gray-400 line-through decoration-red-500/75 dark:text-gray-200/65')}>
            {value}
          </span>
        ),
        ...getColumnSearchProps('content'),
      },
      {
        title: 'Typ',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        filters: [
          { text: 'Meldung', value: 'USER' },
          { text: 'Lagemeldung', value: 'LAGEMELDUNG' },
          { text: 'Ressourcen', value: 'RESSOURCEN' },
          { text: 'Betroffene | Patienten', value: 'BETROFFENE_PATIENTEN' },
        ],
        filterMultiple: true,
        onFilter: (value, record) => record.type === value,
      },
      {
        render: (_, record) => (
          <div className="flex gap-2">
            {!record.archived && (
              <>
                <Tooltip title="Eintrag überschreiben">
                  <Button onClick={() => !isOpen && modifyEntry(record)} type="dashed" shape="circle" icon={<PiSwap />} />
                </Tooltip>
                <Tooltip title="Eintrag streichen">
                  <Button onClick={() => archiveEinsatztagebuchEintrag.mutate({ entryId: record.id })} type="default" danger shape="circle" icon={<PiTextStrikethrough />} />
                </Tooltip>
              </>
            )}
          </div>
        ),
        dataIndex: 'id',
        width: 150,
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
            <Table
              dataSource={einsatztagebuch?.data.items}
              loading={!einsatztagebuch}
              columns={columns}
              virtual
              scroll={{ x: true }}
              pagination={false}
              locale={{
                emptyText: <Empty image={<PiEmpty size={48} />} description="Keine Einträge verfügbar" />,
              }}
            />
          </div>
        </div>
      </div>
      <Drawer open={isOpen} onClose={onDrawerClose} title={editingEintrag && `Eintrag von ${format(editingEintrag.timestamp, natoDateTime)} bearbeiten`}>
        {
          editingEintrag && (
            <FormLayout<JournalEntryDto>
              formik={{
                initialValues: {
                  ...editingEintrag,
                  sender:
                    [...(fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []), ...(fahrzeuge.data?.data.verfuegbareFahrzeuge ?? [])].find((e) => e.fullOpta === editingEintrag.sender)?.id ??
                    editingEintrag.sender,
                  receiver:
                    [...(fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []), ...(fahrzeuge.data?.data.verfuegbareFahrzeuge ?? [])].find((e) => e.fullOpta === editingEintrag.receiver)?.id ??
                    editingEintrag.receiver,
                },
                onSubmit: async (data) => {
                  await createEinsatztagebuchEintrag.mutateAsync({
                    ...data,
                    // FIXME[ember-rescue-68](rubeen, 30.11.24): this may be simplyfied
                    absender: (fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []).find((e) => e.id === data.sender)?.fullOpta ?? data.sender,
                    empfaenger: (fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []).find((e) => e.id === data.receiver)?.fullOpta ?? data.receiver,
                  });
                  await archiveEinsatztagebuchEintrag.mutateAsync({ entryId: editingEintrag?.id });
                  setIsOpen(false);
                  setEditingEintrag(null);
                },
              }}
            >
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
          )
          // <GenericForm<EinsatztagebuchEintrag>
          //   defaultValues={{
          //     ...editingEintrag,
          //     absender: fahrzeuge.data?.find(e => e.funkrufname === editingEintrag.absender)?.id ?? editingEintrag.absender,
          //     empfaenger: fahrzeuge.data?.find(e => e.funkrufname === editingEintrag.empfaenger)?.id ?? editingEintrag.empfaenger,
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
          //           items: fahrzeugeAsItems,
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
          //           items: fahrzeugeAsItems,
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
