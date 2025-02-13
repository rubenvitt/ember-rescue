import { FlightProtocolDto, PreFlightChecksDto } from '@bluelight-hub/shared/client/index.js';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { PiAirplaneTakeoff } from 'react-icons/pi';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormContentBox } from './form/FormContentBox.component.js';
import { FormLayout } from './form/FormLayout.comonent.js';
import { FormSection } from './form/FormSection.component.js';

interface Props {
    onSubmit: (data: { data: FlightProtocolDto }) => void;
    einsatzId: string;
    preFlightData: PreFlightChecksDto;
    verfuegbarePiloten: Array<{ id: string; name: string }>;
}

export function FlugForm({ onSubmit, einsatzId, preFlightData, verfuegbarePiloten }: Props) {
    const [form] = Form.useForm();

    const handleSubmit = useCallback(
        async (formData: any) => {
            const data: { data: FlightProtocolDto } = {
                data: {
                    id: crypto.randomUUID(),
                    einsatzId,
                    preFlightId: preFlightData.id,
                    takeoff: dayjs(),
                    ...formData,
                },
            };
            onSubmit(data);
        },
        [onSubmit, einsatzId, preFlightData]
    );

    return (
        <FormLayout
            resetOnSubmit={false}
            formInstance={form}
            form={{
                onFinish: handleSubmit,
                initialValues: {
                    drohnenmodell: preFlightData.drohnenmodell,
                    batteriestandStart: 100,
                },
            }}
        >
            {() => (
                <div className="flex flex-col gap-4">
                    <FormSection heading="Personal" subHeading="Verantwortliche Personen">
                        <FormContentBox>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="pilot" label="Pilot" rules={[{ required: true }]}>
                                    <Select
                                        options={verfuegbarePiloten.map(p => ({ value: p.id, label: p.name }))}
                                        placeholder="Pilot auswählen"
                                    />
                                </InputWrapper>
                                <InputWrapper name="copilot" label="Co-Pilot">
                                    <Select
                                        options={verfuegbarePiloten.map(p => ({ value: p.id, label: p.name }))}
                                        placeholder="Co-Pilot auswählen (optional)"
                                    />
                                </InputWrapper>
                            </div>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Flugdetails" subHeading="Mission und technische Parameter">
                        <FormContentBox>
                            <InputWrapper name="missionsziel" label="Missionsziel" rules={[{ required: true }]}>
                                <Input.TextArea rows={2} placeholder="Beschreibung des Flugauftrags" />
                            </InputWrapper>
                            <div className="grid grid-cols-3 gap-4">
                                <InputWrapper name="maxFlughoehe" label="Maximale Flughöhe (m)" rules={[{ required: true }]}>
                                    <InputNumber min={0} max={10000} className="w-full" />
                                </InputWrapper>
                                <InputWrapper name="anzahlStarts" label="Geplante Starts" rules={[{ required: true }]}>
                                    <InputNumber min={1} defaultValue={1} className="w-full" />
                                </InputWrapper>
                                <InputWrapper name="batteriestandStart" label="Batteriestand (%)" rules={[{ required: true }]}>
                                    <InputNumber min={0} max={100} className="w-full" />
                                </InputWrapper>
                            </div>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Wetterbedingungen" subHeading="Aktuelle Bedingungen am Startplatz">
                        <FormContentBox>
                            <div className="grid grid-cols-3 gap-4">
                                <InputWrapper name="temperatur" label="Temperatur (°C)" rules={[{ required: true }]}>
                                    <InputNumber className="w-full" />
                                </InputWrapper>
                                <InputWrapper name="windgeschwindigkeit" label="Windgeschwindigkeit (km/h)" rules={[{ required: true }]}>
                                    <InputNumber min={0} className="w-full" />
                                </InputWrapper>
                                <InputWrapper name="windrichtung" label="Windrichtung" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: 'N', label: 'Nord' },
                                            { value: 'NO', label: 'Nordost' },
                                            { value: 'O', label: 'Ost' },
                                            { value: 'SO', label: 'Südost' },
                                            { value: 'S', label: 'Süd' },
                                            { value: 'SW', label: 'Südwest' },
                                            { value: 'W', label: 'West' },
                                            { value: 'NW', label: 'Nordwest' },
                                        ]}
                                    />
                                </InputWrapper>
                            </div>
                            <InputWrapper name="sicht" label="Sichtverhältnisse" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: 'SEHR_GUT', label: 'Sehr gut' },
                                        { value: 'GUT', label: 'Gut' },
                                        { value: 'MAESSIG', label: 'Mäßig' },
                                        { value: 'SCHLECHT', label: 'Schlecht' },
                                    ]}
                                />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <Button type="primary" htmlType="submit" icon={<PiAirplaneTakeoff size={24} />} className="w-full">
                        Take-off
                    </Button>
                </div>
            )}
        </FormLayout>
    );
} 