import { FahrzeugTemplateDto } from '@bluelight-hub/shared/client/index.js';
import { Form, InputNumber } from 'antd';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { useFahrzeuge } from '../../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { useOpta } from '../../../../hooks/opta.hook.js';
import { CopyableId } from '../../atoms/CopyableId.component.js';
import { JsonImExport } from '../../molecules/JsonImExport.component.js';
import { OptaInput } from '../../molecules/OptaInput.component.js';
import { TableActions } from '../../molecules/TableActions.component.js';
import { EditableColumnsType, EditableTable } from './EditableTable.component.js';
import { EditModal } from './EditModal.component.js';

type EditingStore = {
  isModalOpen: boolean;
  editingItem: FahrzeugTemplateDto | null;
  openModal: (item?: FahrzeugTemplateDto) => void;
  closeModal: () => void;
};

const useEditingStore = create<EditingStore>((setState) => ({
  isModalOpen: false,
  editingItem: null,
  openModal: (item?: FahrzeugTemplateDto) => setState({ isModalOpen: true, editingItem: item || null }),
  closeModal: () => setState({ isModalOpen: false, editingItem: null }),
}));


function filterDataSource(data: (FahrzeugTemplateDto | undefined)[]): FahrzeugTemplateDto[] {
  return data.filter((item): item is FahrzeugTemplateDto => item !== undefined);
}

function FahrzeugFormModal() {
  const { isModalOpen, editingItem, closeModal } = useEditingStore();
  const { updateFahrzeugTemplate, createFahrzeugTemplate } = useFahrzeuge();
  const [form] = Form.useForm<FahrzeugTemplateDto>();

  const handleSubmit = async (values: FahrzeugTemplateDto) => {
    try {
      if (editingItem) {
        await updateFahrzeugTemplate.mutateAsync({ ...values, id: editingItem.id });
        toast.success('Fahrzeug erfolgreich aktualisiert');
      } else {
        await createFahrzeugTemplate.mutateAsync(values);
        toast.success('Fahrzeug erfolgreich erstellt');
      }
      closeModal();
    } catch (error) {
      toast.error('Fehler beim Speichern des Fahrzeugs');
    }
  };

  return (
    <EditModal<FahrzeugTemplateDto>
      title={editingItem ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug erstellen'}
      isOpen={isModalOpen}
      onClose={closeModal}
      onSubmit={handleSubmit}
      initialValues={editingItem ?? undefined}
      form={form}
      isLoading={updateFahrzeugTemplate.isPending || createFahrzeugTemplate.isPending}
    >
      <Form.Item name="opta" label="Taktisches Zeichen" rules={[{ required: true }]}>
        <OptaInput />
      </Form.Item>
      <Form.Item name="kapazitaet" label="Standardanzahl Kräfte" rules={[{ required: true }]}>
        <InputNumber min={0} className="w-full" />
      </Form.Item>
    </EditModal>
  );
}

export function EditableFahrzeugeTable() {
  const { templateFahrzeuge, fahrzeugeJson, updateFahrzeugeJson, removeVehicleTemplate } = useFahrzeuge();
  const { openModal } = useEditingStore();
  const { functionOpta } = useOpta();

  const functionCodeMap = useMemo(() => {
    return new Map(functionOpta.data?.data.map((opta) => [opta.code, opta]));
  }, [functionOpta.data]);

  const columns = useMemo<EditableColumnsType<FahrzeugTemplateDto>>(
    () => [
      {
        title: 'Interne ID',
        dataIndex: 'id',
        width: 100,
        render: (value: string) => <CopyableId value={value} />,
      },
      {
        title: 'Taktisches Zeichen',
        dataIndex: 'opta',
        render: (opta: FahrzeugTemplateDto['opta']) => opta.fullOpta
      },
      {
        title: 'Typ des Fahrzeugs',
        dataIndex: 'fahrzeugTyp',
        render: (_: unknown, record: FahrzeugTemplateDto) => {
          if (!record.opta.functionCode) {
            return null;
          }

          const functionOpta = functionCodeMap.get(record.opta.functionCode);
          if (!functionOpta) {
            return record.opta.functionCode;
          }
          return (
            <div>
              <p>
                {functionOpta.code} - {functionOpta.label}
              </p>
              <p className="text-sm text-gray-600">{functionOpta.group}</p>
            </div>
          );
        },
      },
      { title: 'Standardanzahl Kräfte', dataIndex: 'kapazitaet' },
      {
        title: <TableActions<FahrzeugTemplateDto> record={{} as FahrzeugTemplateDto} onAdd={() => openModal()} isHeader />,
        dataIndex: 'actions',
        render: (_: unknown, record: FahrzeugTemplateDto) => (
          <TableActions<FahrzeugTemplateDto>
            record={record}
            onEdit={openModal}
            onDelete={async (record) => {
              try {
                await removeVehicleTemplate.mutateAsync(record.id);
                toast.success('Fahrzeug erfolgreich gelöscht');
              } catch (error) {
                toast.error('Fehler beim Löschen des Fahrzeugs');
              }
            }}
          />
        ),
      },
    ],
    [functionCodeMap],
  );

  return (
    <>
      <EditableTable<FahrzeugTemplateDto>
        title="Fahrzeug-Template Verwaltung"
        dataSource={filterDataSource(templateFahrzeuge.data?.data ?? [])}
        loading={templateFahrzeuge.isLoading}
        columns={columns}
        extraComponent={
          <JsonImExport
            jsonData={fahrzeugeJson.data}
            onImport={async (data) => {
              await updateFahrzeugeJson.mutateAsync({ json: data }, {
                onSuccess() {
                  toast.success('JSON erfolgreich eingespielt');
                },
                onError() {
                  toast.warning('Fehler beim Einspielen der Fahrzeuge-JSON');
                },
              });
            }}
            entityName="Fahrzeuge"
            importDisabled={true}
          />
        }
      />
      <FahrzeugFormModal />
    </>
  );
}
