import { Popover, Typography } from 'antd';
import { useMemo } from 'react';
import { useOpta } from '../../../hooks/opta.hook.js';

interface OptaTooltipProps {
    fullOpta: string;
    children?: React.ReactNode;
}

const { Text } = Typography;

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
            <div className="space-y-4 max-w-md p-1">
                {/* Hauptinformationen */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="flex items-center gap-2">
                        {districtTemplate && (
                            <Text strong className="text-lg !text-gray-900 dark:!text-gray-100">{districtTemplate.label}</Text>
                        )}
                        {bosTemplate && (
                            <Text strong className="text-lg !text-gray-900 dark:!text-gray-100">{bosTemplate.label}</Text>
                        )}
                    </div>
                    {ort && (
                        <Text className="text-base !text-gray-700 dark:!text-gray-300">{ort}</Text>
                    )}
                </div>

                {/* Funktionale Details */}
                <div className="grid grid-cols-2 gap-4">
                    {localCodeTemplate && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                            <Text type="secondary" className="block text-xs !text-gray-500 dark:!text-gray-400">Örtliche Kennung</Text>
                            <Text strong className="block !text-gray-900 dark:!text-gray-100">{localCodeTemplate.label}</Text>
                            <Text type="secondary" className="block text-xs mt-1 !text-gray-500 dark:!text-gray-400">{localCodeTemplate.group}</Text>
                        </div>
                    )}

                    {functionTemplate && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                            <Text type="secondary" className="block text-xs !text-gray-500 dark:!text-gray-400">Funktionskennung</Text>
                            <Text strong className="block !text-gray-900 dark:!text-gray-100">{functionTemplate.label}</Text>
                            <Text type="secondary" className="block text-xs mt-1 !text-gray-500 dark:!text-gray-400">{functionTemplate.group}</Text>
                        </div>
                    )}
                </div>

                {/* Zusätzliche Informationen */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-2">
                    {bosTemplate?.group && (
                        <div>
                            <Text type="secondary" className="block text-xs !text-gray-500 dark:!text-gray-400">BOS Gruppe</Text>
                            <Text className="!text-gray-700 dark:!text-gray-300">{bosTemplate.group}</Text>
                        </div>
                    )}

                    {orderNumber && (
                        <div>
                            <Text type="secondary" className="block text-xs !text-gray-500 dark:!text-gray-400">Ordnungsnummer</Text>
                            <Text className="!text-gray-700 dark:!text-gray-300">{orderNumber}</Text>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [fullOpta, functionOpta.data, districtOpta.data, localCodeOpta.data, bosOpta.data]);

    return (
        <Popover
            content={popoverContent}
            title={null}
            placement="top"
            trigger="hover"
            overlayStyle={{ maxWidth: '500px' }}
        >
            {children ?? fullOpta}
        </Popover>
    );
}; 