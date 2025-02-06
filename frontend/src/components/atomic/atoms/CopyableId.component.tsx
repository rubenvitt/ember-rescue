import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Button, Tooltip } from 'antd';
import { PiFingerprint } from 'react-icons/pi';

interface CopyableIdProps {
    value: string;
}

export function CopyableId({ value }: CopyableIdProps) {
    return (
        <Tooltip
            title={value}
            trigger={'click'}
            onOpenChange={async (visible) => {
                if (visible) return await writeText(value);
            }}
        >
            <Button type="text" shape="circle">
                <PiFingerprint />
            </Button>
        </Tooltip>
    );
} 