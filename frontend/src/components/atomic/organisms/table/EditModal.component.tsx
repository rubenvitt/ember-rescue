import { FahrzeugTemplateDto, UAVTemplateDto } from '@bluelight-hub/shared/client/index.js';
import type { FormInstance } from 'antd';
import { Button, Form, Modal } from 'antd';
import { ReactNode, useEffect } from 'react';
import { PiCheck, PiX } from 'react-icons/pi';

interface EditModalProps<T extends UAVTemplateDto | FahrzeugTemplateDto> {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: T) => Promise<void>;
    children: ReactNode;
    isLoading?: boolean;
    initialValues?: T;
    form: FormInstance<T>;
}

export function EditModal<T extends UAVTemplateDto | FahrzeugTemplateDto>({
    title,
    isOpen,
    onClose,
    onSubmit,
    children,
    isLoading,
    initialValues,
    form
}: EditModalProps<T>) {
    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
        }
    }, [form, isOpen]);

    return (
        <Modal
            title={title}
            open={isOpen}
            onCancel={handleClose}
            destroyOnClose={true}
            afterClose={() => form.resetFields()}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={initialValues}
                preserve={false}
            >
                {children}
                <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                    <Button onClick={handleClose} icon={<PiX />}>
                        Abbrechen
                    </Button>
                    <Button type="primary" htmlType="submit" icon={<PiCheck />} loading={isLoading}>
                        {initialValues ? 'Aktualisieren' : 'Erstellen'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 