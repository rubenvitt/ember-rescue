import { CreateUAVMissionDto, FlightProtocolDto, FlightProtocolDtoStatusEnum, PostFlightChecksDto, UAVMissionDto } from '@bluelight-hub/shared/client/index.ts';
import { Button, Empty, Segmented, Steps, Table, Tag } from 'antd';
import { format } from 'date-fns';
import { useState } from 'react';
import { PiAirplaneLanding, PiAirplaneTakeoff, PiClipboardText, PiEmpty, PiPlus } from 'react-icons/pi';
import { natoDateTime } from '../../../utils/time.js';
import { FlugForm } from './FlugForm.component.js';
import { PostFlightForm } from './PostFlightForm.component.js';
import { PreFlightForm } from './PreFlightForm.component.js';

interface Props {
    einsaetze: UAVMissionDto[];
    fluege: FlightProtocolDto[];
    verfuegbarePiloten: Array<{ id: string; name: string }>;
    einsatzleiter: Array<{ id: string; name: string }>;
    verfuegbareDrohnen: Array<{ id: string; modell: string }>;
    onPreFlightSubmit: (data: CreateUAVMissionDto, uavIndex: number) => void;
    onFlugSubmit: (data: FlightProtocolDto, uavIndex: number) => void;
    onPostFlightSubmit: (data: PostFlightChecksDto, uavIndex: number) => void;
    onFlugBeenden: (flugId: number) => void;
}

export function DrohnenEinsatzComponent({
    einsaetze,
    fluege,
    verfuegbarePiloten,
    einsatzleiter,
    onPreFlightSubmit,
    onFlugSubmit,
    onPostFlightSubmit,
    onFlugBeenden,
}: Props) {
    const [showForm, setShowForm] = useState(false);
    const [selectedEinsatzId, setSelectedEinsatzId] = useState<string | undefined>();

    const selectedEinsatz = selectedEinsatzId
        ? einsaetze.find(e => e.index === parseInt(selectedEinsatzId))
        : einsaetze[0];

    const getStatusColor = (status: FlightProtocolDtoStatusEnum) => {
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

    const getStatusText = (status: FlightProtocolDtoStatusEnum) => {
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
            render: (status: FlightProtocolDtoStatusEnum) => (
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
            render: (_: any, record: FlightProtocolDto) => (
                record.status === 'INFLIGHT' && (
                    <Button
                        color="danger"
                        variant="text"
                        icon={<PiAirplaneLanding size={16} />}
                        onClick={() => onFlugBeenden(record.index)}
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
                        onSubmit={(data) => onPreFlightSubmit(data, 0)}
                        einsatzId=""
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
                        onSubmit={(data) => onPreFlightSubmit(data, selectedEinsatz.index)}
                        einsatzId={selectedEinsatz.id}
                    />
                </div>
            );
        }

        if (selectedEinsatz.status === 'ACTIVE') {
            const einsatzFluege = fluege.filter(f => f.einsatzId === selectedEinsatz.id); // TODO: what to do here?

            return (
                <div className='space-y-4'>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-semibold">Flüge</h2>
                            <p className="text-gray-500 text-sm">Verwalten Sie die Flüge dieses Einsatzes</p>
                        </div>
                        <Button
                            type="default"
                            icon={<PiPlus size={16} />}
                            onClick={() => setShowForm(true)}
                        >
                            Neuer Flug
                        </Button>
                    </div>

                    {showForm ? (
                        <FlugForm
                            onSubmit={(data) => {
                                onFlugSubmit(data, parseInt(selectedEinsatz.in));
                                setShowForm(false);
                            }}
                            einsatzId={selectedEinsatz.id}
                            preFlightData={selectedEinsatz.preFlightChecks!}
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
                        onSubmit={(data) => onPostFlightSubmit(data, selectedEinsatz.index)}
                        einsatzId={selectedEinsatz.index.toString()}
                        einsatzleiter={einsatzleiter}
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                {einsaetze.length > 0 && (
                    <Segmented
                        value={selectedEinsatzId}
                        onChange={(value) => setSelectedEinsatzId(value as string)}
                        options={einsaetze.map(e => ({
                            value: e.index.toString(),
                            label: (
                                <div className="px-4 py-2">
                                    <div className="font-medium">TODO: Bezeichnung</div>
                                    <div className="text-sm text-gray-500">
                                        TODO: Beginn{ /*format(e.beginn, natoDateTime)*/}
                                    </div>
                                    <Tag color={e.status === 'ACTIVE' ? 'green' : 'blue'} className="mt-1">
                                        {e.status === 'PREFLIGHT_CHECKS' ? 'Vorbereitung' :
                                            e.status === 'ACTIVE' ? 'Aktiv' :
                                                e.status === 'POSTFLIGHT_CHECKS' ? 'Abschluss' :
                                                    'Beendet'}
                                    </Tag>
                                </div>
                            )
                        }))}
                        className="bg-white"
                    />
                )}
                <div className="flex justify-end">
                    <Button
                        type="primary"
                        icon={<PiPlus size={16} />}
                        onClick={() => setSelectedEinsatzId(undefined)}
                    >
                        Neuer Einsatz
                    </Button>
                </div>
            </div>

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

            <div className='bg-white my-8 rounded-lg border border-gray-200 p-4'>
                {renderContent()}
            </div>
        </div>
    );
} 