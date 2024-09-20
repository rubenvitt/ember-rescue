import { useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAlarmstichworte } from '../../../../hooks/alarmstichworte.hook.js';
import { useEinsatz } from '../../../../hooks/einsatz.hook.js';
import { useEinheiten } from '../../../../hooks/einheiten/einheiten.hook.js';
import * as Yup from 'yup';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import { FormLayout } from '../../organisms/form/FormLayout.comonent.js';
import dayjs from 'dayjs';
import { PiArrowCircleUpRight } from 'react-icons/pi';
import { FormSection } from '../../organisms/form/FormSection.component.js';
import { FormContentBox } from '../../organisms/form/FormContentBox.component.js';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { DatePicker, Select } from 'formik-antd';

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

const SetupEinsatzSchema = Yup.object().shape({
  erstAlarmiert: Yup.string().required('Zeitpunkt der Erstalarmierung wird benötigt'),
  aufnehmendesRettungsmittel: Yup.string().required('Das Aufnehmende Rettungsmittel wird benötigt'),
  alarmstichwort: Yup.string().required('Geben Sie ein Einsatzstichwort an'),
});

export function NewSetupEinsatzForm() {
  const { einheiten } = useEinheiten();
  const { alarmstichworte } = useAlarmstichworte();
  const { createEinsatz, saveEinsatz } = useEinsatz();
  const navigate = useNavigate();

  const einheitenItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return einheiten.data?.map(
      (einheit) =>
        ({
          value: einheit.id,
          searchString: einheit.funkrufname.toLowerCase() + einheit.einheitTyp.label.toLowerCase(),
          label: (
            <div className="flex justify-between gap-4">
              <span className="flex-shrink-0 truncate">{einheit.funkrufname}</span>
              <span className="ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300">
                {einheit.einheitTyp.label}
              </span>
            </div>
          ),
          item: einheit,
        }) as DefaultOptionType,
    );
  }, [einheiten.data]);

  const alarmstichworteItems = useMemo<DefaultOptionType[] | undefined>(() => {
    return alarmstichworte.data?.map(
      (stichwort) =>
        ({
          value: stichwort.id,
          searchString: (stichwort.bezeichnung + stichwort.beschreibung).toLowerCase(),
          label: (
            <div className="flex justify-between gap-4">
              <span className="flex-shrink-0 truncate">{stichwort.bezeichnung}</span>
              <span className="ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300">
                {stichwort.beschreibung}
              </span>
            </div>
          ),
        }) as DefaultOptionType,
    );
  }, [alarmstichworte.data]);

  const handleAbbrechen = useCallback(() => navigate({ to: '/auth/signout' }), [navigate]);

  return (
    <FormLayout
      type="sectioned"
      formik={{
        validationSchema: SetupEinsatzSchema,
        initialValues: { erstAlarmiert: dayjs().toISOString(), aufnehmendesRettungsmittel: '', alarmstichwort: '' },
        onSubmit: async (data) => {
          console.log('my data', { data });
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
          <InputWrapper label="Aufnehmendes Rettungsmittel" name="aufnehmendesRettungsmittel">
            <Select
              name="aufnehmendesRettungsmittel"
              placeholder="Aufnehmendes Rettungsmittel"
              className="w-full"
              showSearch
              // @ts-ignore
              spellCheck={false}
              filterOption={(inputValue, option) => option?.searchString.includes(inputValue.toLowerCase())}
              options={einheitenItems}
              loading={einheiten.isLoading}
            />
          </InputWrapper>
        </FormContentBox>
      </FormSection>

      <FormSection heading="Alarmierung" subHeading="Informationen zur Alarmierung">
        <FormContentBox>
          <InputWrapper label="Zeitpunkt der Erstalarmierung" name="erstAlarmiert">
            <DatePicker className="w-full" showTime showSecond={false} name="erstAlarmiert" />
          </InputWrapper>
          <InputWrapper label="Einsatzstichwort der Alarmierung" name="alarm">
            <Select
              name="alarmstichwort"
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
