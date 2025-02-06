import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Collapse, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { PiCode } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';

interface JsonImExportProps {
    jsonData: string | undefined;
    onImport: (data: string) => Promise<void>;
    importDisabled?: boolean;
    entityName: string;
}

export function JsonImExport({ jsonData, onImport, importDisabled, entityName }: JsonImExportProps) {
    const [importForm] = Form.useForm<{ json: string }>();
    const [exportForm] = Form.useForm<{ json: string }>();

    useEffect(() => {
        if (!importForm.isFieldsTouched()) {
            importForm.setFieldsValue({ json: jsonData });
        }
        exportForm.setFieldsValue({ json: jsonData });
    }, [jsonData]);

    return (
        <Collapse ghost={true} bordered={false} className="w-full">
            <Collapse.Panel header="Erweiterte Funktionen" key="1" className="w-full text-left">
                <div className="flex justify-items-stretch gap-4">
                    <FormLayout<{ json: string }>
                        buttons={{
                            submit: {
                                children: <>{entityName} kopieren</>,
                                htmlType: 'submit',
                                icon: <PiCode size={24} />,
                                variant: 'dashed',
                            },
                        }}
                        form={{
                            ...exportForm,
                            className: 'flex flex-1 flex-col justify-between',
                            initialValues: { json: jsonData },
                            async onFinish() {
                                await writeText(jsonData ?? '', { label: `${entityName}.json` });
                                toast.success(`${entityName}.json wurde kopiert`);
                            },
                        }}
                    >
                        <Typography.Text>Export-JSON</Typography.Text>
                        <InputWrapper name="json">
                            <Input.TextArea
                                rows={6}
                                onFocus={(e) =>
                                    setTimeout(async () => {
                                        e.target.select();
                                    })
                                }
                            />
                        </InputWrapper>
                    </FormLayout>

                    <FormLayout<{ json: string }>
                        form={{
                            ...importForm,
                            initialValues: { json: jsonData },
                            validateTrigger: 'onBlur',
                            async onFinish(data: { json: string }) {
                                try {
                                    await onImport(data.json);
                                } catch (error) {
                                    toast.error('Ungültiges JSON-Format');
                                }
                            },
                            className: 'flex flex-1 flex-col justify-between',
                        }}
                        buttons={{
                            submit: {
                                children: <>{entityName} speichern</>,
                                disabled: importDisabled,
                                htmlType: 'submit',
                                icon: <PiCode size={24} />,
                                variant: 'dashed',
                            },
                        }}
                    >
                        <Typography.Text>Import-JSON</Typography.Text>
                        <InputWrapper
                            name={'json'}
                            rules={[
                                {
                                    validator(_: unknown, value: string) {
                                        try {
                                            JSON.parse(value);
                                        } catch (e) {
                                            return Promise.reject('Invalid JSON format');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input.TextArea name="json" rows={6} />
                        </InputWrapper>
                    </FormLayout>
                </div>
            </Collapse.Panel>
        </Collapse>
    );
} 