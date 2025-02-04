import { Button, Form, Input, Select } from 'antd';
import { useCallback } from 'react';
import { PiCheck } from 'react-icons/pi';
import { CreatePostFlightDto } from '../../../types/app/flugprotokoll.types.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormContentBox } from './form/FormContentBox.component.js';
import { FormLayout } from './form/FormLayout.comonent.js';
import { FormSection } from './form/FormSection.component.js';

interface Props {
    onSubmit: (data: CreatePostFlightDto) => void;
    einsatzId: string;
    einsatzleiter: Array<{ id: string; name: string }>;
}

export function PostFlightForm({ onSubmit, einsatzId, einsatzleiter }: Props) {
    const [form] = Form.useForm();

    const handleSubmit = useCallback(
        async (formData: any) => {
            const data: CreatePostFlightDto = {
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
                    <FormSection heading="Technische Überprüfung" subHeading="Zustand des Luftfahrzeugs">
                        <FormContentBox>
                            <InputWrapper name="schaeden" label="Schäden festgestellt" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: false, label: 'Keine Schäden' },
                                        { value: true, label: 'Schäden vorhanden' },
                                    ]}
                                />
                            </InputWrapper>
                            <InputWrapper name="schadensBeschreibung" label="Beschreibung der Schäden">
                                <Input.TextArea rows={2} placeholder="Art und Umfang der Schäden" />
                            </InputWrapper>
                            <InputWrapper name="wartungNotwendig" label="Wartung erforderlich" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: false, label: 'Keine Wartung notwendig' },
                                        { value: true, label: 'Wartung erforderlich' },
                                    ]}
                                />
                            </InputWrapper>
                            <InputWrapper name="wartungshinweise" label="Wartungshinweise">
                                <Input.TextArea rows={2} placeholder="Notwendige Wartungsarbeiten" />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Einsatzauswertung" subHeading="Bewertung des Einsatzes">
                        <FormContentBox>
                            <InputWrapper name="einsatzzielErreicht" label="Einsatzziel erreicht" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: true, label: 'Vollständig erreicht' },
                                        { value: false, label: 'Nicht vollständig erreicht' },
                                    ]}
                                />
                            </InputWrapper>
                            <InputWrapper name="auswertung" label="Einsatzauswertung" rules={[{ required: true }]}>
                                <Input.TextArea rows={3} placeholder="Detaillierte Auswertung des Einsatzes" />
                            </InputWrapper>
                            <InputWrapper name="verbesserungsvorschlaege" label="Verbesserungsvorschläge">
                                <Input.TextArea rows={2} placeholder="Vorschläge für zukünftige Einsätze" />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Dokumentation" subHeading="Bildmaterial und Daten">
                        <FormContentBox>
                            <InputWrapper name="bildmaterialVorhanden" label="Bildmaterial vorhanden" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: true, label: 'Bildmaterial vorhanden' },
                                        { value: false, label: 'Kein Bildmaterial' },
                                    ]}
                                />
                            </InputWrapper>
                            <InputWrapper name="bildmaterialBeschreibung" label="Beschreibung des Bildmaterials">
                                <Input.TextArea rows={2} placeholder="Art und Umfang des Bildmaterials" />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <FormSection heading="Abschluss" subHeading="Freigabe und Bemerkungen">
                        <FormContentBox>
                            <InputWrapper name="einsatzleiterFreigabe" label="Freigabe durch Einsatzleiter" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { value: true, label: 'Freigegeben' },
                                        { value: false, label: 'Nicht freigegeben' },
                                    ]}
                                />
                            </InputWrapper>
                            <InputWrapper name="freigegebenVon" label="Freigegeben durch" rules={[{ required: true }]}>
                                <Select
                                    options={einsatzleiter.map(el => ({ value: el.id, label: el.name }))}
                                    placeholder="Einsatzleiter auswählen"
                                />
                            </InputWrapper>
                            <InputWrapper name="abschlussBemerkungen" label="Abschließende Bemerkungen">
                                <Input.TextArea rows={3} placeholder="Zusätzliche Anmerkungen zum Einsatz" />
                            </InputWrapper>
                        </FormContentBox>
                    </FormSection>

                    <Button type="primary" htmlType="submit" icon={<PiCheck size={24} />} className="w-full">
                        Einsatz abschließen
                    </Button>
                </div>
            )}
        </FormLayout>
    );
} 