import { Button, Form, Input, Select } from 'antd';
import { useCallback } from 'react';
import { PiCheck } from 'react-icons/pi';
import { CreatePreFlightDto } from '../../../types/app/flugprotokoll.types.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormContentBox } from './form/FormContentBox.component.js';
import { FormLayout } from './form/FormLayout.comonent.js';
import { FormSection } from './form/FormSection.component.js';

interface Props {
    onSubmit: (data: CreatePreFlightDto) => void;
    einsatzId: string;
}

export function PreFlightForm({ onSubmit, einsatzId }: Props) {
    const [form] = Form.useForm();

    const handleSubmit = useCallback(
        async (formData: any) => {
            const data: CreatePreFlightDto = {
                data: {
                    einsatzId,
                    ...formData,
                },
            };
            onSubmit(data);
        },
        [onSubmit, einsatzId]
    );

    return (
        <FormLayout
            resetOnSubmit={false}
            formInstance={form}
            form={{
                onFinish: handleSubmit,
            }}
        >
            {() => (
                <div className="flex flex-col gap-4">
                    <FormSection heading="Drohne und Ausrüstung" subHeading="Technische Details des Luftfahrzeugs">
                        <FormContentBox>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="drohnenmodell" label="Drohnenmodell" rules={[{ required: true }]}>
                                    <Input />
                                </InputWrapper>
                                <InputWrapper name="seriennummer" label="Seriennummer" rules={[{ required: true }]}>
                                    <Input />
                                </InputWrapper>
                            </div>
                            <InputWrapper name="konfiguration" label="Konfiguration" rules={[{ required: true }]}>
                                <Input.TextArea rows={2} placeholder="Installierte Sensoren, Kameras, etc." />
                            </InputWrapper>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="nutzlast" label="Nutzlast" rules={[{ required: true }]}>
                                    <Input />
                                </InputWrapper>
                                <InputWrapper name="firmware" label="Firmware-Version" rules={[{ required: true }]}>
                                    <Input />
                                </InputWrapper>
                            </div>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Einsatzgebiet" subHeading="Details zum Fluggebiet">
                        <FormContentBox>
                            <InputWrapper name="standort" label="Standort" rules={[{ required: true }]}>
                                <Input placeholder="Koordinaten oder Adresse" />
                            </InputWrapper>
                            <InputWrapper name="gelaendebeschreibung" label="Geländebeschreibung" rules={[{ required: true }]}>
                                <Input.TextArea rows={3} placeholder="Besonderheiten des Geländes, Hindernisse, etc." />
                            </InputWrapper>
                            <div className="grid grid-cols-2 gap-4">
                                <InputWrapper name="luftraumklasse" label="Luftraumklasse" rules={[{ required: true }]}>
                                    <Select
                                        options={[
                                            { value: 'C', label: 'Luftraum C' },
                                            { value: 'D', label: 'Luftraum D' },
                                            { value: 'E', label: 'Luftraum E' },
                                            { value: 'G', label: 'Luftraum G' },
                                        ]}
                                    />
                                </InputWrapper>
                                <InputWrapper name="flugverbotszonen" label="Flugverbotszonen">
                                    <Input placeholder="Bekannte Einschränkungen" />
                                </InputWrapper>
                            </div>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Vorflugkontrolle" subHeading="Checklisten und Sicherheit">
                        <FormContentBox>
                            <InputWrapper name="checklistenAbgearbeitet" label="Checkliste" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: true, label: 'Vollständig abgearbeitet' },
                                        { value: false, label: 'Nicht vollständig' },
                                    ]}
                                />
                            </InputWrapper>
                            <InputWrapper name="risikobeurteilung" label="Risikobeurteilung" rules={[{ required: true }]}>
                                <Input.TextArea rows={3} placeholder="Zusammenfassung der Gefährdungsbeurteilung" />
                            </InputWrapper>
                            <InputWrapper name="wetterbedingungen" label="Wetterbedingungen" rules={[{ required: true }]}>
                                <Input.TextArea rows={2} placeholder="Aktuelle Wetterlage und Vorhersage" />
                            </InputWrapper>
                            <InputWrapper name="notfallprozeduren" label="Notfallprozeduren" rules={[{ required: true }]}>
                                <Input.TextArea rows={2} placeholder="Festgelegte Notfallmaßnahmen" />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Genehmigungen & Dokumentation" subHeading="Rechtliche Anforderungen">
                        <FormContentBox>
                            <InputWrapper name="flugerlaubnis" label="Flugerlaubnis">
                                <Input placeholder="Aktenzeichen oder Referenz" />
                            </InputWrapper>
                            <InputWrapper name="luftraumfreigabe" label="Luftraumfreigabe">
                                <Input placeholder="NOTAM oder Freigabe" />
                            </InputWrapper>
                            <InputWrapper name="bemerkungen" label="Zusätzliche Bemerkungen">
                                <Input.TextArea rows={2} />
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