import { Button, Tooltip } from 'antd';
import { PiPencil, PiPlus, PiTrash } from 'react-icons/pi';

interface TableActionsProps<T> {
    record: T;
    onEdit?: (record: T) => void;
    onDelete?: (record: T) => void;
    onAdd?: () => void;
    isHeader?: boolean;
}

export function TableActions<T>({ record, onEdit, onDelete, onAdd, isHeader }: TableActionsProps<T>) {
    if (isHeader) {
        return (
            <div className="flex justify-center">
                <Tooltip title="Neuen Eintrag hinzufügen">
                    <Button icon={<PiPlus />} onClick={onAdd} />
                </Tooltip>
            </div>
        );
    }

    return (
        <div className="flex justify-center space-x-2">
            {onEdit && (
                <Button
                    type="text"
                    icon={<PiPencil />}
                    onClick={() => onEdit(record)}
                />
            )}
            {onDelete && (
                <Button
                    type="text"
                    danger
                    icon={<PiTrash />}
                    onClick={() => onDelete(record)}
                />
            )}
        </div>
    );
} 