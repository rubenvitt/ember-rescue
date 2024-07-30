import React, { useMemo } from 'react';
import { GenericForm } from '../../organisms/GenericForm.component.js';
import { useNavigate } from '@tanstack/react-router';
import { useAlarmstichworte } from '../../../../hooks/alarmstichworte.hook.js';
import { useEinsatz } from '../../../../hooks/einsatz.hook.js';
import { format } from 'date-fns';
import { useEinheiten } from '../../../../hooks/einheiten/einheiten.hook.js';
import { CreateEinsatz } from '../../../../types/app/einsatz.types.js';
import { SearchBox } from '@mapbox/search-js-react';
import { useSecret } from '../../../../hooks/secrets.hook.js';

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
//           {/* @ts-ignore FIXME */}
//           {suggestions.map((suggestion, index) => (
//             <li key={index}>{suggestion.place_name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

export const SetupEinsatzForm: React.FC = () => {
  const navigate = useNavigate();
  const { secret } = useSecret({ secretKey: 'mapboxApi' });

  const { einheiten } = useEinheiten();
  const { createEinsatz, saveEinsatz } = useEinsatz();
  const { alarmstichworte } = useAlarmstichworte();
  const alarmstichworteItems = useMemo(() => alarmstichworte.data?.map(item => ({
    item,
    label: item.bezeichnung,
    secondary: item.beschreibung,
  })) ?? [], [alarmstichworte.data]);


  return (
    <section id="newEinsatzForm" className="w-full pb-6">
      {secret.data &&
        // @ts-ignore
        <SearchBox value="" accessToken={secret.data?.value ?? ''} theme={{ variables: { colorPrimary: 'red' } }}
                   options={{ language: 'de', country: 'de', proximity: [10.55, 52.96] }} />
      }
      <GenericForm<CreateEinsatz>
        layout="complex"
        resetText="Abbrechen"
        submitText="Einsatz erstellen"
        onReset={() => {
          navigate({ to: '/auth/signout' });
        }}
        onSubmit={async (values) => {
          await createEinsatz.mutateAsync(values).then((einsatz) => {
            saveEinsatz(einsatz);
            navigate({ to: '/app/' });
          });
        }} defaultValues={{
        erstAlarmiert: format(new Date(), `yyyy-MM-dd'T'HH:mm`),
      }} sections={[
        {
          fields: [
            {
              label: 'Aufnehmendes Rettungsmittel',
              name: 'aufnehmendesRettungsmittel',
              type: 'combo',
              items: einheiten.data?.map((einheit) => ({
                item: einheit,
                label: einheit.funkrufname,
                secondary: einheit.einheitTyp.label,
              })) ?? [],
              validators: {
                onChange: ({ value }: { value: string }) => {
                  if (value === '') {
                    return 'Bitte wählen Sie das aufnehmende Rettungsmittel aus';
                  }
                },
              },
            },
          ],
          title: 'Einsatzdaten',
          description: 'Basisdaten des Einsatzes',
        },
        {
          fields: [
            {
              name: 'erstAlarmiert',
              label: 'Erstalarmierung',
              type: 'datetime-local',
            },
            {
              name: 'alarmstichwort',
              label: 'Einsatzstichwort der Alarmierung',
              type: 'combo',
              items: alarmstichworteItems,
              validators: {
                onChange: ({ value }: { value: string }) => {
                  if (value === '') {
                    return 'Bitte wählen Sie das Einsatzstichwort der Alarmierung aus';
                  }
                },
              },
            },
          ],
          title: 'Alarmierung',
          description: 'Informationen zur Alarmierung',
        },
      ]} />
    </section>
  );
};