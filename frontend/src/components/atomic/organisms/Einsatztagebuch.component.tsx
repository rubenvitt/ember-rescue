import { Input as AntInput, Button, Drawer, Empty, Input, InputRef, Select, Space, Table, TableColumnsType, TableColumnType, Tooltip } from 'antd';
import { format } from 'date-fns';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PiAmbulance, PiEmpty, PiMagnifyingGlass, PiPencil, PiPictureInPicture, PiPlus, PiSwap, PiTextStrikethrough, PiUser } from 'react-icons/pi';
import { twMerge } from 'tailwind-merge';
import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { useFahrzeuge } from '../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { natoDateTime } from '../../../utils/time.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { EinsatztagebuchFormWrapperComponent } from '../molecules/EinsatztagebuchFormWrapper.component.js';
import { EinsatztagebuchHeaderComponent } from '../molecules/EinsatztagebuchHeader.component.js';
import { FormLayout } from './form/FormLayout.comonent.js';

import { JournalEntryDto } from '@bluelight-hub/shared/client/index.js';
import dayjs from 'dayjs';
import { useFahrzeugeItems } from '../../../hooks/fahrzeuge/fahrzeuge-items.hook.ts';

export function EinsatztagebuchComponent() {
  const { einsatztagebuch, archiveEinsatztagebuchEintrag, createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const [inputVisible, setInputVisible] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEintrag, setEditingEintrag] = useState<JournalEntryDto | null>(null);
  const { fahrzeuge } = useFahrzeuge();
  const { fahrzeugeAsItems: fahrzeugeImEinsatzAsItems, loading: fahrzeugeImEinsatzLoading } = useFahrzeugeItems({
    include: ['fahrzeugeImEinsatz'],
  });
  const { fahrzeugeAsItems: fahrzeugeNichtImEinsatzAsItems, loading: fahrzeugeNichtImEinsatzLoading } = useFahrzeugeItems({
    include: ['fahrzeugeNichtImEinsatz'],
  });
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
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
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
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: 'Typ',
        dataIndex: 'type',
        key: 'type',
        width: 60,
        filters: [
          { text: 'Meldung', value: 'USER' },
          { text: 'Lagemeldung', value: 'LAGEMELDUNG' },
          { text: 'Ressourcen', value: 'RESSOURCEN' },
          { text: 'Betroffene | Patienten', value: 'BETROFFENE_PATIENTEN' },
          { text: 'Korrektur', value: 'KORREKTUR' },
        ],
        render: (value) => {
          switch (value) {
            case 'USER':
              return <Tooltip placement='top' title="Meldung"><PiUser size={24} className="text-primary-500" /></Tooltip>;
            case 'LAGEMELDUNG':
              return <Tooltip placement='top' title="Lagemeldung"><PiPictureInPicture size={24} className="text-red-500" /></Tooltip>;
            case 'RESSOURCEN':
              return <Tooltip placement='top' title="Ressourcen"><PiAmbulance size={24} className="text-primary-500" /></Tooltip>;
            case 'BETROFFENE_PATIENTEN':
              return <Tooltip placement='top' title="Betroffene | Patienten"><PiPlus size={24} className="text-primary-500" /></Tooltip>;
            case 'KORREKTUR':
              return <Tooltip placement='top' title="Korrektur"><PiPencil size={24} className="text-orange-500" /></Tooltip>;
            default:
              return value;
          }
        },
        filterMultiple: true,
        onFilter: (value, record) => record.type === value,
      },
      {
        title: 'Zeitpunkt',
        key: 'timestamp',
        width: 200,
        filters: [
          { text: 'Alle Einträge', value: 'timestamp' },
          { text: 'Bearbeitete Einträge', value: 'createdAt' },
          { text: 'Gelöschte Einträge', value: 'updatedAt' },
        ],
        filterMode: 'menu',
        filterMultiple: false,
        defaultFilteredValue: ['timestamp'],
        sortDirections: ['ascend', 'descend', 'ascend'],
        defaultSortOrder: 'descend',
        onFilter: (value, record) => {
          const timestampAsNato = format(record.timestamp, natoDateTime);
          const createdAsNato = format(record.createdAt, natoDateTime);
          const updatedAsNato = format(record.updatedAt, natoDateTime);
          const selectedField = value as keyof Pick<JournalEntryDto, 'timestamp' | 'createdAt' | 'updatedAt'>;
          return selectedField === 'timestamp' || (selectedField === 'createdAt' ? createdAsNato !== timestampAsNato : (record.archived && updatedAsNato !== timestampAsNato));
        },
        sorter: (a, b) => {
          const selectedFilter = (columns.find(col => col.key === 'timestamp')?.filteredValue?.[0] ?? 'timestamp') as keyof Pick<JournalEntryDto, 'timestamp' | 'createdAt' | 'updatedAt'>;
          return dayjs(a[selectedFilter] as any).diff(dayjs(b[selectedFilter] as any), 'milliseconds');
        },
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
      },
      {
        title: 'Absender',
        dataIndex: 'sender',
        key: 'sender',
        width: 120,
        render: (_value, record) => smallOpta(record.sender),
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
        render: (_value, record) => smallOpta(record.receiver),
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
        render: (_, record) => (
          <div className="flex gap-2">
            {!record.archived && (
              <>
                <Tooltip title="Eintrag überschreiben">
                  <Button onClick={() => !isOpen && modifyEntry(record)} type="dashed" shape="circle" icon={<PiSwap />} />
                </Tooltip>
                <Tooltip title="Eintrag streichen">
                  <Button onClick={() => {
                    console.log('mutating', { record });
                    return archiveEinsatztagebuchEintrag.mutate({ nummer: record.nummer });
                  }} type="default" danger shape="circle" icon={<PiTextStrikethrough />} />
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
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <div className="w-full py-2 align-middle sm:px-6 lg:px-8">
            <Table
              className="mb"
              dataSource={einsatztagebuch?.data.items}
              loading={!einsatztagebuch}
              columns={columns}
              scroll={{ y: 1000 }}
              pagination={false}
              locale={{
                emptyText: <Empty image={<PiEmpty size={48} />} description="Keine Einträge verfügbar" />,
              }}
            />
          </div>
        </div>
      </div>
      <Drawer open={isOpen} onClose={onDrawerClose} title={editingEintrag && `Eintrag ${editingEintrag.nummer} von ${format(editingEintrag.timestamp, natoDateTime)} bearbeiten`}>
        {editingEintrag && (
          <FormLayout<JournalEntryDto>
            form={{
              initialValues: {
                ...editingEintrag,
                sender:
                  [...(fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []), ...(fahrzeuge.data?.data.verfuegbareFahrzeuge ?? [])].find((e) => e.fullOpta === editingEintrag.sender)?.fullOpta ??
                  editingEintrag.sender,
                receiver:
                  [...(fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []), ...(fahrzeuge.data?.data.verfuegbareFahrzeuge ?? [])].find((e) => e.fullOpta === editingEintrag.receiver)?.fullOpta ??
                  editingEintrag.receiver,
              },
              onFinish: async (data) => {
                await createEinsatztagebuchEintrag.mutateAsync({
                  ...data,
                  type: 'KORREKTUR',
                  timestamp: editingEintrag.timestamp,
                  absender: (fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []).find((e) => e.fullOpta === data.sender)?.fullOpta ?? data.sender,
                  empfaenger: (fahrzeuge.data?.data.fahrzeugeImEinsatz ?? []).find((e) => e.fullOpta === data.receiver)?.fullOpta ?? data.receiver,
                });
                await archiveEinsatztagebuchEintrag.mutateAsync({ nummer: editingEintrag?.nummer });
                setIsOpen(false);
                setEditingEintrag(null);
              },
            }}
            buttons={{
              submit: {
                children: 'Eintrag ändern',
                icon: <PiSwap />,
              },
            }}
          >
            <InputWrapper label="Absender" name="sender" rules={[{ required: true, message: 'Es sollte ein Absender angegeben werden' }]}>
              <Select
                showSearch
                placeholder="Absender auswählen"
                loading={fahrzeugeImEinsatzLoading || fahrzeugeNichtImEinsatzLoading}
                options={[
                  {
                    label: 'Fahrzeuge im Einsatz',
                    options: fahrzeugeImEinsatzAsItems ?? [],
                  },
                  {
                    label: 'Verfügbare Fahrzeuge',
                    options: fahrzeugeNichtImEinsatzAsItems ?? [],
                  },
                ]}
              />
            </InputWrapper>
            <InputWrapper label="Empfänger" name="receiver" rules={[{ required: true, message: 'Es sollte ein Empfänger angegeben werden' }]}>
              <Select
                showSearch
                placeholder="Empfänger auswählen"
                loading={fahrzeugeImEinsatzLoading || fahrzeugeNichtImEinsatzLoading}
                options={[
                  {
                    label: 'Fahrzeuge im Einsatz',
                    options: fahrzeugeImEinsatzAsItems ?? [],
                  },
                  {
                    label: 'Verfügbare Fahrzeuge',
                    options: fahrzeugeNichtImEinsatzAsItems ?? [],
                  },
                ]}
              />
            </InputWrapper>
            <InputWrapper label="Notiz" name="content">
              <Input.TextArea rows={5} />
            </InputWrapper>
          </FormLayout>
        )}
      </Drawer>
    </div>
  );
}

function smallOpta(fullOpta: string) {
  const optaMatch = fullOpta.match(/(?:.*?)(\d+-\d+(?:-\d+)?)(.*)?$/);
  return optaMatch ? `${optaMatch[1]}${optaMatch[2] || ''}` : fullOpta;
}