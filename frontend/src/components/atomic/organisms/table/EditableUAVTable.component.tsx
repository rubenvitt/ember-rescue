import { UAVTemplateDto } from '@bluelight-hub/shared/client/index.js';
import { Form, Input, InputNumber } from 'antd';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { useUAV } from '../../../../hooks/uav/uav.hook.js';
import { CopyableId } from '../../atoms/CopyableId.component.js';
import { JsonImExport } from '../../molecules/JsonImExport.component.js';
import { TableActions } from '../../molecules/TableActions.component.js';
import { EditableColumnsType, EditableTable } from './EditableTable.component.js';
import { EditModal } from './EditModal.component.js';

type EditingStore = {
    isModalOpen: boolean;
    editingItem: UAVTemplateDto | null;
    openModal: (item?: UAVTemplateDto) => void;
    closeModal: () => void;
};

const useEditingStore = create<EditingStore>((setState) => ({
    isModalOpen: false,
    editingItem: null,
    openModal: (item?: UAVTemplateDto) => setState({ isModalOpen: true, editingItem: item || null }),
    closeModal: () => setState({ isModalOpen: false, editingItem: null }),
}));

function filterDataSource(data: (UAVTemplateDto | undefined)[]): UAVTemplateDto[] {
    return data.filter((item): item is UAVTemplateDto => item !== undefined);
}

function UAVFormModal() {
    const { isModalOpen, editingItem, closeModal } = useEditingStore();
    const { updateUAVTemplate, createUAVTemplate } = useUAV();
    const [form] = Form.useForm<UAVTemplateDto>();

    const handleSubmit = async (values: UAVTemplateDto) => {
        try {
            if (editingItem) {
                await updateUAVTemplate.mutateAsync({ ...values, id: editingItem.id });
                toast.success('Drohne erfolgreich aktualisiert');
            } else {
                await createUAVTemplate.mutateAsync(values);
                toast.success('Drohne erfolgreich erstellt');
            }
            closeModal();
        } catch (error) {
            toast.error('Fehler beim Speichern der Drohne');
        }
    };

    return (
        <EditModal<UAVTemplateDto>
            title={editingItem ? 'Drohne bearbeiten' : 'Neue Drohne erstellen'}
            isOpen={isModalOpen}
            onClose={closeModal}
            onSubmit={handleSubmit}
            initialValues={editingItem ?? undefined}
            form={form}
            isLoading={updateUAVTemplate.isPending || createUAVTemplate.isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                <Form.Item name="modell" label="Modell" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="seriennummer" label="Seriennummer" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="konfiguration" label="Konfiguration" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="nutzlast" label="Nutzlast" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="firmware" label="Firmware" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="maxFlugzeit" label="Max. Flugzeit (min)" rules={[{ required: true }]}>
                    <InputNumber min={0} className="w-full" />
                </Form.Item>
                <Form.Item name="maxFlughoehe" label="Max. Flughöhe (m)" rules={[{ required: true }]}>
                    <InputNumber min={0} max={10000} className="w-full" />
                </Form.Item>
                <Form.Item name="maxGeschwindigkeit" label="Max. Geschw. (km/h)" rules={[{ required: true }]}>
                    <InputNumber min={0} className="w-full" />
                </Form.Item>
                <Form.Item name="gewicht" label="Gewicht (kg)" rules={[{ required: true }]}>
                    <InputNumber min={0} className="w-full" />
                </Form.Item>
            </div>
        </EditModal>
    );
}

export function EditableUAVTable() {
    const { templateUAVs, uavJson, updateUAVJson, removeUAVTemplate } = useUAV();
    const { openModal } = useEditingStore();

    const columns = useMemo<EditableColumnsType<UAVTemplateDto>>(
        () => [
            {
                title: 'Interne ID',
                dataIndex: 'id',
                width: 100,
                render: (value: string) => <CopyableId value={value} />,
            },
            { title: 'Modell', dataIndex: 'modell' },
            { title: 'Seriennummer', dataIndex: 'seriennummer' },
            { title: 'Konfiguration', dataIndex: 'konfiguration' },
            { title: 'Nutzlast', dataIndex: 'nutzlast' },
            { title: 'Firmware', dataIndex: 'firmware' },
            { title: 'Max. Flugzeit (min)', dataIndex: 'maxFlugzeit' },
            { title: 'Max. Flughöhe (m)', dataIndex: 'maxFlughoehe' },
            { title: 'Max. Geschw. (km/h)', dataIndex: 'maxGeschwindigkeit' },
            { title: 'Gewicht (kg)', dataIndex: 'gewicht' },
            {
                title: <TableActions<UAVTemplateDto> record={{} as UAVTemplateDto} onAdd={() => openModal()} isHeader />,
                dataIndex: 'actions',
                render: (_: unknown, record: UAVTemplateDto) => (
                    <TableActions<UAVTemplateDto>
                        record={record}
                        onEdit={openModal}
                        onDelete={async (record) => {
                            try {
                                await removeUAVTemplate.mutateAsync(record.id);
                                toast.success('Drohne erfolgreich gelöscht');
                            } catch (error) {
                                toast.error('Fehler beim Löschen der Drohne');
                            }
                        }}
                    />
                ),
            },
        ],
        [],
    );

    return (
        <>
            <EditableTable<UAVTemplateDto>
                title="Drohnen-Template Verwaltung"
                dataSource={filterDataSource(templateUAVs.data?.data ?? [])}
                loading={templateUAVs.isLoading}
                columns={columns}
                extraComponent={
                    <JsonImExport
                        jsonData={uavJson.data}
                        onImport={async (data) => {
                            try {
                                const parsedItems = JSON.parse(data);
                                await updateUAVJson.mutateAsync({
                                    items: Array.isArray(parsedItems) ? parsedItems : [parsedItems]
                                });
                                toast.success('JSON erfolgreich eingespielt');
                            } catch (error) {
                                toast.error('Ungültiges JSON-Format');
                            }
                        }}
                        entityName="UAVs"
                    />
                }
            />
            <UAVFormModal />
        </>
    );
}
