import { useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAlarmstichworte } from '../../../../hooks/alarmstichworte.hook.js';
import { useEinsatz } from '../../../../hooks/einsatz.hook.js';
import { useFahrzeuge } from '../../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import { FormLayout } from '../../organisms/form/FormLayout.comonent.js';
import dayjs from 'dayjs';
import { PiArrowCircleUpRight } from 'react-icons/pi';
import { FormSection } from '../../organisms/form/FormSection.component.js';
import { FormContentBox } from '../../organisms/form/FormContentBox.component.js';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { CreateMissionDto } from '@bluelight-hub/shared/client/index.js';
import { useOpta } from '../../../../hooks/opta.hook.js';
import { DatePicker, Select } from 'antd';

// const AddressAutocomplete: React.FC = () => {
//   const { secret } = useSecret({ secretKey: 'mapboxApi' });
//   const { retrieve } = useMapboxAutofill({
//     accessToken: secret.data?.value,
//     country: 'de',
//     language: 'de-DE',
//     streets: true,
//   });
//
//   const [query, setQuery] = useState('');
//   const [suggestions, setSuggestions] = useState<any>([]);
//
//   const handleChange = async (event: any) => {
//     const value = event.target.value;
//     setQuery(value);
//     if (value) {
//       const results = await retrieve(value, { sessionToken: 'test-asd' });
//       setSuggestions(results);
//     } else {
//       setSuggestions([]);
//     }
//   };
//
//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={handleChange}
//         placeholder="Adresse eingeben..."
//       />
//       {suggestions.length > 0 && (
//         <ul>
//           {suggestions.map((suggestion, index) => (
//             <li key={index}>{suggestion.place_name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

export function NewSetupEinsatzForm() {
  // FIXME[ember-rescue-68](rubeen, 30.11.24): Use fahrzeugeTemplate
  const { templateFahrzeuge } = useFahrzeuge();
  const { functionOpta } = useOpta();
  const { alarmstichworte } = useAlarmstichworte();
  const { createEinsatz, saveEinsatz } = useEinsatz();
  const navigate = useNavigate();

  const fahrzeugeItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return templateFahrzeuge.data?.data.map((fahrzeug) => {
      let fahrzeugFunctionOpta = functionOpta.data?.data.find((opta) => opta.code === fahrzeug.opta.functionCode);
      return {
        value: fahrzeug.fullOpta,
        searchString: fahrzeug.fullOpta.toLowerCase() + fahrzeugFunctionOpta?.label.toLowerCase(),
        label: (
          <div className="flex justify-between gap-4">
            <span className="flex-shrink-0 truncate">{fahrzeug.fullOpta}</span>
            <span className="ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300">{fahrzeugFunctionOpta?.label}</span>
          </div>
        ),
        item: fahrzeug,
      } as DefaultOptionType;
    });
  }, [templateFahrzeuge.data, functionOpta.data]);

  const alarmstichworteItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return alarmstichworte.data?.data.map(
      (stichwort) =>
        ({
          value: stichwort.id,
          searchString: (stichwort.code + stichwort.description).toLowerCase(),
          label: (
            <div className="flex justify-between gap-4">
              <span className="flex-shrink-0 truncate">{stichwort.code}</span>
              <span className="ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300">{stichwort.description}</span>
            </div>
          ),
        }) as DefaultOptionType,
    );
  }, [alarmstichworte.data]);

  const handleAbbrechen = useCallback(() => navigate({ to: '/auth/signout' }), [navigate]);

  return (
    <FormLayout<CreateMissionDto>
      type="sectioned"
      form={{
        initialValues: {
          erstAlarmiert: dayjs(),
        },
        async onFinish(data) {
          console.log('createMissionDto', { data });
          await createEinsatz.mutateAsync({ ...data }).then((einsatz) => {
            saveEinsatz(einsatz);
            navigate({ to: '/app/' });
          });
        },
      }}
      buttons={{
        cancel: { type: 'dashed', onClick: handleAbbrechen, children: 'Abbrechen' },
        submit: {
          type: 'primary',
          htmlType: 'submit',
          icon: <PiArrowCircleUpRight />,
          iconPosition: 'end',
          children: 'Einsatz anlegen',
        },
      }}
    >
      <FormSection heading="Einsatzdaten" subHeading="Grundlegende Daten zum Einsatz">
        <FormContentBox>
          <InputWrapper label="Aufnehmendes Rettungsmittel" name="aufnehmendesRettungsmittel" rules={[{ required: true, message: 'Das aufnehmende Rettungsmittel wird benötigt' }]}>
            <Select
              placeholder="Aufnehmendes Rettungsmittel"
              className="w-full"
              showSearch
              // @ts-ignore
              spellCheck={false}
              filterOption={(inputValue, option) => option?.searchString.includes(inputValue.toLowerCase())}
              options={fahrzeugeItems}
              loading={templateFahrzeuge.isLoading}
            />
          </InputWrapper>
        </FormContentBox>
      </FormSection>

      <FormSection heading="Alarmierung" subHeading="Informationen zur Alarmierung">
        <FormContentBox>
          <InputWrapper label="Zeitpunkt der Erstalarmierung" name="erstAlarmiert" rules={[{ required: true, message: 'Zeitpunkt der Erstalarmierung wird benötigt' }]}>
            <DatePicker className="w-full" showTime showSecond={false} name="erstAlarmiert" />
          </InputWrapper>
          <InputWrapper label="Einsatzstichwort der Alarmierung" name="alarm" rules={[{ required: true, message: 'Geben Sie ein Einsatzstichwort an' }]}>
            <Select
              placeholder="Einsatzstichwort der Alarmierung"
              className="w-full"
              showSearch
              // @ts-ignore
              spellCheck={false}
              filterOption={(inputValue, option) => {
                // Create a regular expression that matches the characters of inputValue in sequence, ignoring spaces.
                const regex = new RegExp(inputValue.split('').join('.*'), 'i');
                return regex.test(option?.searchString);
              }}
              options={alarmstichworteItems}
              loading={alarmstichworte.isLoading}
            />
          </InputWrapper>
        </FormContentBox>
      </FormSection>
    </FormLayout>
  );
}
