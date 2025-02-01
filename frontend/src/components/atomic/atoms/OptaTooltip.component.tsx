import { Popover, Typography } from 'antd';
import { useMemo } from 'react';
import { useOpta } from '../../../hooks/opta.hook.js';

interface OptaTooltipProps {
    fullOpta: string;
    children?: React.ReactNode;
}

const { Text, Title } = Typography;

export const OptaTooltip = ({ fullOpta, children }: OptaTooltipProps) => {
    const { functionOpta, districtOpta, localCodeOpta, bosOpta } = useOpta();

    const popoverContent = useMemo(() => {
        if (!fullOpta) return null;

        // Parse OPTA string
        const parts = fullOpta.split(' ');
        const lastPart = parts[parts.length - 1];
        const [localCode, functionCode, orderNumber] = lastPart?.split('-') ?? [];

        const district = parts[0];
        const bos = parts[1];
        const ort = parts.length > 3 ? parts[2] : '';

        // Find matching templates
        const districtTemplate = districtOpta.data?.data.find(d => d.code === district);
        const bosTemplate = bosOpta.data?.data.find(b => b.code === bos);
        const localCodeTemplate = localCodeOpta.data?.data.find(l => l.code === localCode);
        const functionTemplate = functionOpta.data?.data.find(f => f.code === functionCode);

        return (
            <div className="space-y-2 max-w-md">
                <Title level={5} className="!mb-2">OPTA Details</Title>

                {districtTemplate && (
                    <div>
                        <Text type="secondary" className="block text-xs">Bezirk</Text>
                        <Text strong>{districtTemplate.label}</Text>
                    </div>
                )}

                {bosTemplate && (
                    <div>
                        <Text type="secondary" className="block text-xs">BOS</Text>
                        <Text strong>{bosTemplate.label}</Text>
                        <Text type="secondary" className="block text-xs">{bosTemplate.group}</Text>
                    </div>
                )}

                {ort && (
                    <div>
                        <Text type="secondary" className="block text-xs">Ort</Text>
                        <Text strong>{ort}</Text>
                    </div>
                )}

                {localCodeTemplate && (
                    <div>
                        <Text type="secondary" className="block text-xs">Örtliche Kennung</Text>
                        <Text strong>{localCodeTemplate.label}</Text>
                        <Text type="secondary" className="block text-xs">{localCodeTemplate.group}</Text>
                    </div>
                )}

                {functionTemplate && (
                    <div>
                        <Text type="secondary" className="block text-xs">Funktionskennung</Text>
                        <Text strong>{functionTemplate.label}</Text>
                        <Text type="secondary" className="block text-xs">{functionTemplate.group}</Text>
                    </div>
                )}

                {orderNumber && (
                    <div>
                        <Text type="secondary" className="block text-xs">Ordnungsnummer</Text>
                        <Text strong>{orderNumber}</Text>
                    </div>
                )}
            </div>
        );
    }, [fullOpta, functionOpta.data, districtOpta.data, localCodeOpta.data, bosOpta.data]);

    return (
        <Popover
            content={popoverContent}
            title={null}
            placement="top"
            trigger="hover"
        >
            {children ?? fullOpta}
        </Popover>
    );
}; 