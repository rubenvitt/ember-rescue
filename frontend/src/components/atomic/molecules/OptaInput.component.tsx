import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { PiPen } from 'react-icons/pi';
import { useToggle } from '@reactuses/core';
import { useOpta } from '../../../hooks/opta.hook.js';
import { OptaDto } from '@bluelight-hub/shared/client/index.js';

export type OptaInput = OptaDto;

type FieldConfig = {
  name: keyof Omit<OptaDto, 'id' | 'fullOpta'>;
  placeholder: string;
  width: number;
};

type OptaOptions = {
  [key in 'district' | 'bosCode' | 'localCode' | 'functionCode']: { code: string; description: string }[];
} & { ort?: never; orderNumber?: never; supplement?: never };

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
  options: OptaOptions;
  handleInputChange: (name: keyof Omit<OptaDto, 'id' | 'fullOpta'>, value: string) => void;
  formData: OptaInput;
}) => {
  return (
    <div>
      <div>
        {options[name] ? (
          <Select
            value={formData[name]}
            onChange={(value: string) => {
              console.log(`changed select ${value}`);
              handleInputChange(name, value);
            }}
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

export const OptaInputField = () => <>TODO</>;

// FIXME[ember-rescue-68](rubeen, 16.12.24): rewrite this:
// export const OptaInputField = ({ name, validate, fast, onChange }: FormikFieldProps & { onChange: (value: OptaInput) => void }) => {
//   return (
//     <Field name={name} validate={validate} fast={fast}>
//       {({ field: { value }, form: { setFieldValue, setFieldTouched } }) => (
//         <OptaInput
//           value={value}
//           onBlur={(value) => {
//             setFieldTouched(name);
//             onChange && onChange(value);
//           }}
//           onChange={useCallback(
//             (value: OptaInput) => {
//               console.log(`updating ${name} = ${value}`);
//               setFieldValue(name, value);
//
//               if (onChange) {
//                 onChange(value);
//               }
//             },
//             [setFieldValue, name],
//           )}
//         />
//       )}
//     </Field>
//   );
// };

export const OptaInput = ({ onChange, value }: { onChange: (value: OptaInput) => void; onBlur: (value: OptaInput) => void; value?: OptaInput }) => {
  const [formData, setFormData] = useState<OptaInput>({
    bosCode: '',
    district: '',
    functionCode: '',
    localCode: '',
    orderNumber: '',
    ort: '',
    supplement: '',
    fullOpta: '',
    id: '',
  });
  const { functionOpta } = useOpta();

  const [isFreetext, toggleFreetext] = useToggle(false);
  const [freetext, setFreetext] = useState<string>('');
  const optaOptions = useMemo<OptaOptions>(
    () => ({
      district: [
        { code: 'NI', description: 'Niedersachsen' },
        { code: 'BU', description: 'Bund' },
      ],
      bosCode: [
        { code: 'FW', description: 'Feuerwehr' },
        { code: 'DRK', description: 'Deutsches Rotes Kreuz' },
      ],
      localCode: [
        { code: '40', description: 'Was auch immer' },
        { code: '41', description: 'Noch etwas' },
      ],
      functionCode: functionOpta.data?.data.map((f) => ({ code: f.code, description: f.description })) ?? [],
    }),
    [],
  );

  const handleInputChange = (name: keyof Omit<OptaDto, 'id' | 'fullOpta'>, value: string) => {
    console.log(`updating ${name} = ${value}`);
    setFormData((prevData) => {
      const newFormData = {
        ...prevData,
        [name]: value,
      };
      onChange(newFormData);
      return newFormData;
    });
  };

  useEffect(() => {
    if (value?.fullOpta) {
      setFormData((prevState) => prevState);
      setFreetext(value.fullOpta);
      toggleFreetext(true);
    }
  }, [value?.fullOpta]);

  useEffect(() => {
    onChange(formData);
  }, [formData, isFreetext, freetext, onChange]);

  useEffect(() => {
    console.log('my opta value', value);
  }, [value]);

  return (
    <Space size="small" direction="vertical">
      <Space size="small" className="rounded">
        {isFreetext ? (
          <Input
            value={freetext}
            onChange={(e) => {
              setFreetext(e.target.value);
              setFormData((prevData) => ({
                ...prevData,
                freetext: e.target.value,
              }));
            }}
            placeholder="NI DRK Uelzen 40-12-1"
            style={{ width: 240 }}
            size="middle"
          />
        ) : (
          <Space size="small" direction="vertical">
            <Space size="small">
              {FIELD_CONFIGS.slice(0, 3).map((config) => (
                <SmartInput key={config.name} options={optaOptions} formData={formData} handleInputChange={handleInputChange} {...config} />
              ))}
            </Space>
            <Space size="small">
              {FIELD_CONFIGS.slice(3).map((config, idx) => (
                <Space size={'small'} key={config.name}>
                  {idx > 0 && <span>-</span>}
                  <SmartInput key={config.name} options={optaOptions} formData={formData} handleInputChange={handleInputChange} {...config} />
                </Space>
              ))}
            </Space>
          </Space>
        )}
        <Button className="text-gray-700 dark:text-white" type="text" icon={<PiPen className="h-3.5 w-3.5" size="small" onClick={() => toggleFreetext()} />} />
      </Space>
      <pre className="font-mono text-xs text-gray-500">
        {isFreetext ? freetext : `${formData.district} ${formData.bosCode} ${formData.ort} ${formData.localCode}-${formData.functionCode}-${formData.orderNumber}`}
      </pre>
    </Space>
  );
};
