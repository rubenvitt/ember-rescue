import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { useForm } from '@tanstack/react-form';
import { CreateEinsatztagebuchEintrag } from '../../../types.js';
import { GenericForm } from '../organisms/GenericForm.component.tsx';
import { useEinheiten } from '../../../hooks/einheiten.hook.js';
import { useMemo } from 'react';
import { formatISO } from 'date-fns';

interface Props {
  closeForm: () => void;
}

export function EinsatztagebuchForm({ closeForm }: Props) {
  const { createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const {} = useForm<CreateEinsatztagebuchEintrag>();
  const { einheiten } = useEinheiten();
  // TODO: not only einheiten should be possible. ETB, all used entries should also displayed. And new values should be possible
  const einheitenAsItems = useMemo(() => {
    return [...(einheiten.data?.map(item => ({
      label: item.funkrufname,
      secondary: item.typ,
      item,
    })) ?? [])];
  }, [einheiten.data]);

  return <>
    <GenericForm<CreateEinsatztagebuchEintrag>
      submitText="Eintrag anlegen"
      sections={[{
        fields: [
          {
            name: 'absender',
            label: 'Absender',
            type: 'combo',
            width: 'half',
            items: einheitenAsItems,
          }, {
            name: 'empfaenger',
            label: 'Empfänger',
            type: 'combo',
            width: 'half',
            items: einheitenAsItems,
          },
          {
            name: 'content',
            label: 'Inhalt',
            width: 'full',
            type: 'textarea',
          },
        ],
      },
      ]}
      onSubmit={async (data) => {
        closeForm();
        await createEinsatztagebuchEintrag.mutateAsync({
          type: 'GENERISCH',
          content: data.content,
          empfaenger: einheitenAsItems.find((item) => data.empfaenger === item.item.id)?.item?.funkrufname ?? data.empfaenger,
          absender: einheitenAsItems.find((item) => data.empfaenger === item.item.id)?.item?.funkrufname ?? data.absender,
          timestamp: formatISO(new Date()), //todo timestamp from frontend
        });
      }}
      defaultValues={{
        timestamp: '',
        absender: '',
        empfaenger: 'ETB',
        content: '',
        type: 'GENERISCH',
      }}
    />
  </>;

}