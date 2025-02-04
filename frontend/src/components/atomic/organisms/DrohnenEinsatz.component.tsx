import { Button, Empty, Select, Steps, Table, Tag } from 'antd';
import { format } from 'date-fns';
import { useState } from 'react';
import { PiAirplaneLanding, PiAirplaneTakeoff, PiClipboardText, PiEmpty, PiPlus } from 'react-icons/pi';
import { DrohnenEinsatz, FlugData, FlugStatus, PreFlightData } from '../../../types/app/flugprotokoll.types.js';
import { natoDateTime } from '../../../utils/time.js';
import { FlugForm } from './FlugForm.component.js';
import { PostFlightForm } from './PostFlightForm.component.js';
import { PreFlightForm } from './PreFlightForm.component.js';

interface Props {
    einsaetze: DrohnenEinsatz[];
    fluege: FlugData[];
    verfuegbarePiloten: Array<{ id: string; name: string }>;
    einsatzleiter: Array<{ id: string; name: string }>;
    verfuegbareDrohnen: Array<{ id: string; modell: string }>;
    onPreFlightSubmit: (data: PreFlightData) => void;
    onFlugSubmit: (data: FlugData) => void;
    onPostFlightSubmit: (data: any) => void;
    onFlugBeenden: (flugId: string) => void;
}

export function DrohnenEinsatzComponent({
    einsaetze,
    fluege,
    verfuegbarePiloten,
    einsatzleiter,
    verfuegbareDrohnen,
    onPreFlightSubmit,
    onFlugSubmit,
    onPostFlightSubmit,
    onFlugBeenden,
}: Props) {
    const [showForm, setShowForm] = useState(false);
    const [selectedEinsatzId, setSelectedEinsatzId] = useState<string | undefined>();

    const selectedEinsatz = selectedEinsatzId
        ? einsaetze.find(e => e.id === selectedEinsatzId)
        : einsaetze[0];

    const getStatusColor = (status: FlugStatus) => {
        switch (status) {
            case 'PLANNED':
                return 'blue';
            case 'TAKEOFF':
                return 'green';
            case 'INFLIGHT':
                return 'processing';
            case 'LANDED':
                return 'warning';
            case 'COMPLETED':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: FlugStatus) => {
        switch (status) {
            case 'PLANNED':
                return 'Geplant';
            case 'TAKEOFF':
                return 'Start';
            case 'INFLIGHT':
                return 'Im Flug';
            case 'LANDED':
                return 'Gelandet';
            case 'COMPLETED':
                return 'Abgeschlossen';
            default:
                return status;
        }
    };

    const columns = [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: FlugStatus) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            ),
        },
        {
            title: 'Start',
            dataIndex: 'takeoff',
            key: 'takeoff',
            render: (time: Date) => format(time, natoDateTime),
        },
        {
            title: 'Landung',
            dataIndex: 'landing',
            key: 'landing',
            render: (time?: Date) => (time ? format(time, natoDateTime) : '-'),
        },
        {
            title: 'Pilot',
            dataIndex: 'pilot',
            key: 'pilot',
        },
        {
            title: 'Co-Pilot',
            dataIndex: 'copilot',
            key: 'copilot',
            render: (copilot?: string) => copilot || '-',
        },
        {
            title: 'Mission',
            dataIndex: 'missionsziel',
            key: 'missionsziel',
            ellipsis: true,
        },
        {
            title: 'Aktionen',
            key: 'actions',
            render: (_: any, record: FlugData) => (
                record.status === 'INFLIGHT' && (
                    <Button
                        type="primary"
                        icon={<PiAirplaneLanding size={16} />}
                        onClick={() => onFlugBeenden(record.id)}
                    >
                        Flug beenden
                    </Button>
                )
            ),
        },
    ];

    const renderContent = () => {
        if (!selectedEinsatz) {
            return (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Neuer Drohneneinsatz</h2>
                    </div>
                    <PreFlightForm
                        onSubmit={onPreFlightSubmit}
                        verfuegbareDrohnen={verfuegbareDrohnen}
                        einsatzleiter={einsatzleiter}
                    />
                </div>
            );
        }

        if (selectedEinsatz.status === 'PREFLIGHT_CHECKS') {
            return (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Pre-Flight Check</h2>
                    </div>
                    <PreFlightForm
                        onSubmit={onPreFlightSubmit}
                        verfuegbareDrohnen={verfuegbareDrohnen}
                        einsatzleiter={einsatzleiter}
                        initialData={selectedEinsatz.preFlightData}
                    />
                </div>
            );
        }

        if (selectedEinsatz.status === 'ACTIVE') {
            const einsatzFluege = fluege.filter(f => f.einsatzId === selectedEinsatz.id);

            return (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Flüge</h2>
                        <Button
                            type="primary"
                            icon={<PiPlus size={24} />}
                            onClick={() => setShowForm(true)}
                        >
                            Neuer Flug
                        </Button>
                    </div>

                    {showForm ? (
                        <FlugForm
                            onSubmit={(data) => {
                                onFlugSubmit(data);
                                setShowForm(false);
                            }}
                            einsatzId={selectedEinsatz.id}
                            preFlightData={selectedEinsatz.preFlightData!}
                            verfuegbarePiloten={verfuegbarePiloten}
                        />
                    ) : (
                        <Table
                            dataSource={einsatzFluege}
                            columns={columns}
                            pagination={false}
                            locale={{
                                emptyText: <Empty image={<PiEmpty size={48} />} description="Keine Flüge verfügbar" />,
                            }}
                        />
                    )}
                </div>
            );
        }

        if (selectedEinsatz.status === 'POSTFLIGHT_CHECKS') {
            return (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Post-Flight Check</h2>
                    </div>
                    <PostFlightForm
                        onSubmit={onPostFlightSubmit}
                        einsatzId={selectedEinsatz.id}
                        einsatzleiter={einsatzleiter}
                        initialData={selectedEinsatz.postFlightData}
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="space-y-8">
            {einsaetze.length > 0 && (
                <div className="flex items-center gap-4">
                    <span className="font-medium">Drohneneinsatz:</span>
                    <Select
                        value={selectedEinsatzId}
                        onChange={setSelectedEinsatzId}
                        style={{ width: 300 }}
                        options={einsaetze.map(e => ({
                            value: e.id,
                            label: `${e.bezeichnung} (${format(e.beginn, natoDateTime)})`
                        }))}
                    />
                </div>
            )}

            {selectedEinsatz && (
                <Steps
                    onChange={() => {
                        // TODO: Implement this
                    }}
                    current={['PREFLIGHT_CHECKS', 'ACTIVE', 'POSTFLIGHT_CHECKS', 'COMPLETED'].indexOf(selectedEinsatz.status)}
                    items={[
                        {
                            title: 'Pre-Flight',
                            description: 'Vorbereitung',
                            icon: <PiClipboardText size={24} />,
                        },
                        {
                            title: 'Flüge',
                            description: 'Aktiv',
                            icon: <PiAirplaneTakeoff size={24} />,
                        },
                        {
                            title: 'Post-Flight',
                            description: 'Abschluss',
                            icon: <PiAirplaneLanding size={24} />,
                        },
                    ]}
                />
            )}

            {renderContent()}
        </div>
    );
} 