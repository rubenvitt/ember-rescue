import { PreFlightChecksDto } from '@bluelight-hub/shared/client/index.js';
import { AutoComplete, Button, Form, Input, InputNumber, Select } from 'antd';
import { useCallback } from 'react';
import { PiCheck } from 'react-icons/pi';
import { useUAV } from '../../../hooks/uav/uav.hook.ts';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormContentBox } from './form/FormContentBox.component.js';
import { FormLayout } from './form/FormLayout.comonent.js';
import { FormSection } from './form/FormSection.component.js';

interface Props {
    onSubmit: (data: { data: PreFlightChecksDto }) => void;
    einsatzId: string;
}

export function PreFlightForm({ onSubmit, einsatzId }: Props) {
    const [form] = Form.useForm();
    const { templateUAVs } = useUAV();

    const handleSubmit = useCallback(
        async (formData: any) => {
            const data: { data: PreFlightChecksDto } = {
                data: {
                    id: crypto.randomUUID(),
                    einsatzId,
                    pilot: formData.pilot,
                    copilot: formData.copilot,
                    einsatzleiter: formData.einsatzleiter,
                    wetterbedingungen: {
                        temperatur: formData.temperatur,
                        windgeschwindigkeit: formData.windgeschwindigkeit,
                        niederschlag: formData.niederschlag,
                        sicht: formData.sicht,
                    },
                    checkliste: {
                        akkuGeladen: formData.akkuGeladen,
                        kameraCheck: formData.kameraCheck,
                        propellerCheck: formData.propellerCheck,
                        fernsteuerungCheck: formData.fernsteuerungCheck,
                        kompassKalibriert: formData.kompassKalibriert,
                        gpsVerfuegbar: formData.gpsVerfuegbar,
                        notlandungspunkte: formData.notlandungspunkte,
                    },
                    drohnenmodell: formData.drohnenmodell,
                },
            };
            onSubmit(data);
        },
        [onSubmit, einsatzId]
    );

    return (
        <FormLayout<{ data: PreFlightChecksDto }>
            resetOnSubmit={false}
            formInstance={form}
            form={{
                onFinish: handleSubmit,
            }}
        >
            {() => (
                <div className="flex flex-col gap-4">
                    <FormSection heading="Personal" subHeading="Verantwortliche Personen">
                        <FormContentBox>
                            <div className="grid grid-cols-3 gap-4">
                                <InputWrapper name="pilot" label="Pilot" rules={[{ required: true }]}>
                                    <Input />
                                </InputWrapper>
                                <InputWrapper name="copilot" label="Co-Pilot">
                                    <Input />
                                </InputWrapper>
                                <InputWrapper name="einsatzleiter" label="Einsatzleiter" rules={[{ required: true }]}>
                                    <Input />
                                </InputWrapper>
                            </div>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Drohne" subHeading="Technische Details des Luftfahrzeugs">
                        <FormContentBox>
                            <InputWrapper name="drohnenmodell" label="Drohnenmodell" rules={[{ required: true }]}>
                                <AutoComplete
                                    showSearch
                                    filterOption={(input, option) => (option?.label ?? '').toLocaleLowerCase().includes(input.toLocaleLowerCase())}
                                    options={templateUAVs.data?.data.map(d => ({ value: d.modell, label: d.modell })) ?? []}
                                />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Wetterbedingungen" subHeading="Aktuelle Bedingungen am Startplatz">
                        <FormContentBox>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="temperatur" label="Temperatur (°C)" rules={[{ required: true }]}>
                                    <InputNumber className="w-full" />
                                </InputWrapper>
                                <InputWrapper name="windgeschwindigkeit" label="Windgeschwindigkeit (km/h)" rules={[{ required: true }]}>
                                    <InputNumber min={0} className="w-full" />
                                </InputWrapper>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="niederschlag" label="Niederschlag" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: false, label: 'Kein Niederschlag' },
                                            { value: true, label: 'Niederschlag' },
                                        ]}
                                    />
                                </InputWrapper>
                                <InputWrapper name="sicht" label="Sicht (m)" rules={[{ required: true }]}>
                                    <InputNumber min={0} className="w-full" />
                                </InputWrapper>
                            </div>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Checkliste" subHeading="Vorflugkontrolle">
                        <FormContentBox>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="akkuGeladen" label="Akku geladen" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: true, label: 'Ja' },
                                            { value: false, label: 'Nein' },
                                        ]}
                                    />
                                </InputWrapper>
                                <InputWrapper name="kameraCheck" label="Kamera geprüft" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: true, label: 'Ja' },
                                            { value: false, label: 'Nein' },
                                        ]}
                                    />
                                </InputWrapper>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="propellerCheck" label="Propeller geprüft" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: true, label: 'Ja' },
                                            { value: false, label: 'Nein' },
                                        ]}
                                    />
                                </InputWrapper>
                                <InputWrapper name="fernsteuerungCheck" label="Fernsteuerung geprüft" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: true, label: 'Ja' },
                                            { value: false, label: 'Nein' },
                                        ]}
                                    />
                                </InputWrapper>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="kompassKalibriert" label="Kompass kalibriert" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: true, label: 'Ja' },
                                            { value: false, label: 'Nein' },
                                        ]}
                                    />
                                </InputWrapper>
                                <InputWrapper name="gpsVerfuegbar" label="GPS verfügbar" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: true, label: 'Ja' },
                                            { value: false, label: 'Nein' },
                                        ]}
                                    />
                                </InputWrapper>
                            </div>
                            <InputWrapper name="notlandungspunkte" label="Notlandungspunkte festgelegt" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: true, label: 'Ja' },
                                        { value: false, label: 'Nein' },
                                    ]}
                                />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <Button type="primary" htmlType="submit" icon={<PiCheck size={24} />} className="w-full">
                        Pre-Flight abschließen
                    </Button>
                </div>
            )}
        </FormLayout>
    );
} 