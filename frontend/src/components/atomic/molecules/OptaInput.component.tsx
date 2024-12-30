import { useMemo, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { PiPen } from 'react-icons/pi';
import { useToggle } from '@reactuses/core';
import { useOpta } from '../../../hooks/opta.hook.js';

export type OptaDto = {
  bosCode: string;
  district: string;
  functionCode: string;
  localCode: string;
  orderNumber: string;
  ort: string;
  supplement: string;
  fullOpta?: string;
  id: string;
};

export type OptaInput = OptaDto;

type FieldConfig = {
  name: keyof Omit<OptaDto, 'id' | 'fullOpta' | 'supplement'>;
  placeholder: string;
  width: number;
};

const FIELD_CONFIGS: FieldConfig[] = [
  { name: 'district', placeholder: 'BA', width: 70 },
  { name: 'bosCode', placeholder: 'FW', width: 70 },
  { name: 'ort', placeholder: 'Ort', width: 200 },
  { name: 'localCode', placeholder: '40', width: 55 },
  { name: 'functionCode', placeholder: '2', width: 55 },
  { name: 'orderNumber', placeholder: '1', width: 50 },
];

const SmartInput = ({
  placeholder,
  width,
  name,
  options,
  handleInputChange,
  formData,
}: {
  name: keyof Omit<OptaDto, 'id' | 'fullOpta'>;
  placeholder: string;
  width: number;
  options: Record<string, Array<{ code: string; description: string }>>;
  handleInputChange: (name: keyof Omit<OptaDto, 'id' | 'fullOpta'>, value: string) => void;
  formData: OptaInput;
}) => {
  return (
    <div>
      <div>
        {options[name] ? (
          <Select
            value={formData[name]}
            onChange={(value: string) => handleInputChange(name, value)}
            placeholder={placeholder}
            style={{ width }}
            showSearch
            size="small"
            optionLabelProp="value"
            popupMatchSelectWidth={false}
            options={options[name].map((opt) => ({
              ...opt,
              value: opt.code,
              label: (
                <div className="py-1">
                  <div className="font-medium">{opt.code}</div>
                  <div className="text-xs text-gray-500">{opt.description}</div>
                </div>
              ),
            }))}
            filterOption={(input, option) => {
              const searchString = input.toLocaleLowerCase();
              return (option?.value.toString().toLocaleLowerCase().includes(searchString) ?? false) || (option?.description.toLocaleLowerCase().includes(searchString) ?? false);
            }}
          />
        ) : (
          <Input value={formData[name]} onChange={(e) => handleInputChange(name, e.target.value)} size="small" placeholder={placeholder} style={{ width }} />
        )}
      </div>
    </div>
  );
};

export const OptaInput = ({ onChange, value }: { onChange: (value: OptaInput) => void; value?: OptaInput }) => {
  const [formData, setFormData] = useState<OptaInput>(() => ({
    bosCode: '',
    district: '',
    functionCode: '',
    localCode: '',
    orderNumber: '',
    ort: '',
    supplement: '',
    id: '',
    ...value, // Überschreibe die Default-Werte mit den initialen Werten
  }));

  // Prüfe ob fullOpta gesetzt ist und die anderen Felder leer sind
  const shouldStartWithFreetext = value?.fullOpta && !value.district && !value.bosCode && !value.ort && !value.localCode && !value.functionCode && !value.orderNumber;

  const [isFreetext, toggleFreetext] = useToggle(Boolean(shouldStartWithFreetext));
  const [freetext, setFreetext] = useState(value?.fullOpta || '');

  const { functionOpta, districtOpta, bosOpta, localCodeOpta } = useOpta();

  const optaOptions = useMemo(
    () => ({
      district: districtOpta.data?.data.map((d) => ({
        code: d.code,
        description: d.label,
      })),
      bosCode: bosOpta.data?.data.map((b) => ({
        code: b.code,
        description: b.label,
      })),
      localCode: localCodeOpta.data?.data.map((l) => ({
        code: l.code,
        description: l.label,
      })),
      functionCode:
        functionOpta.data?.data.map((f) => ({
          code: f.code,
          description: f.label,
        })) ?? [],
    }),
    [functionOpta.data?.data],
  );

  const handleInputChange = (name: keyof Omit<OptaDto, 'id' | 'fullOpta'>, newValue: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };
      onChange(updated);
      return updated;
    });
  };

  const handleFreetextChange = (newFreetext: string) => {
    setFreetext(newFreetext);
    const updated = {
      ...formData,
      fullOpta: newFreetext,
    };
    onChange(updated);
  };

  return (
    <Space size="small" direction="vertical">
      <Space size="small" className="rounded">
        {isFreetext ? (
          <Input value={freetext} onChange={(e) => handleFreetextChange(e.target.value)} placeholder="NI DRK Uelzen 40-12-1" style={{ width: 240 }} size="middle" />
        ) : (
          <Space size="small" direction="vertical">
            <Space size="small">
              {FIELD_CONFIGS.slice(0, 3).map((config) => (
                <SmartInput key={config.name} {...config} options={optaOptions} formData={formData} handleInputChange={handleInputChange} />
              ))}
            </Space>
            <Space size="small">
              {FIELD_CONFIGS.slice(3).map((config, idx) => (
                <Space size="small" key={config.name}>
                  {idx > 0 && <span>-</span>}
                  <SmartInput key={config.name} options={optaOptions} formData={formData} handleInputChange={handleInputChange} {...config} />
                </Space>
              ))}
            </Space>
          </Space>
        )}
        <Button className="text-gray-700 dark:text-white" type="text" icon={<PiPen className="h-3.5 w-3.5" />} size="small" onClick={() => toggleFreetext()} />
      </Space>
      <pre className="font-mono text-xs text-gray-500">
        {isFreetext ? freetext : `${formData.district} ${formData.bosCode} ${formData.ort} ${formData.localCode}-${formData.functionCode}-${formData.orderNumber}`}
      </pre>
    </Space>
  );
};
