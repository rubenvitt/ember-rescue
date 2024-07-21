import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { useForm } from '@tanstack/react-form';
import { CreateEinsatztagebuchEintrag, EinheitDto } from '../../../types/types.js';
import { GenericForm } from '../organisms/GenericForm.component.tsx';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { useMemo } from 'react';
import { formatISO } from 'date-fns';
import { ItemType } from './Combobox.component.js';
import { z } from 'zod';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';

interface Props {
  closeForm: () => void;
}

const einsatztagebuchItem: ItemType<EinheitDto> = {
  item: {
    id: 'etb',
    einheitTyp: {
      id: 'etb',
      label: 'ETB',
    },
    kapazitaet: 0,
    istTemporaer: false,
    status: {
      id: 'none',
      code: 'none',
      bezeichnung: 'None',
    },
    funkrufname: 'Einsatztagebuch',
    _count: { einsatz_einheit: 0 },
  },
  label: 'ETB',
  secondary: 'Einsatztagebuch',
};

export function EinsatztagebuchForm({ closeForm }: Props) {
  const { createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const {} = useForm<CreateEinsatztagebuchEintrag>();
  const { einheiten } = useEinheiten();
  const { einsatz } = useEinsatz();
  // TODO: not only einheiten should be possible. ETB, all used entries should also displayed. And new values should be possible
  const einheitenAsItems = useMemo<ItemType<EinheitDto>[]>(() => {
    return [
      einsatztagebuchItem,
      ...(einheiten.data?.map(item => ({
        label: item.funkrufname,
        secondary: item.einheitTyp.label,
        item,
      })) ?? []),
    ];
  }, [einheiten.data]);

  return <GenericForm<CreateEinsatztagebuchEintrag>
    submitText="Eintrag anlegen"
    sections={[{
      fields: [
        {
          name: 'absender',
          label: 'Absender',
          type: 'combo',
          width: 'half',
          items: einheitenAsItems,
          validators: {
            onSubmit: z.string({ message: 'Es sollte ein Absender angegeben werden' }),
          },
        }, {
          name: 'empfaenger',
          label: 'Empfänger',
          type: 'combo',
          width: 'half',
          items: einheitenAsItems,
          validators: {
            onSubmit: z.string({ message: 'Es sollte ein Empfänger angegeben werden' }),
          },
        },
        {
          name: 'content',
          label: 'Inhalt',
          width: 'full',
          type: 'textarea',
          validators: {
            onSubmit: z.string().trim().min(1, 'Ein ETB-Eintrag benötigt eine Nachricht.'),
          },
        },
      ],
    },
    ]}
    onSubmit={async (data) => {
      closeForm();
      await createEinsatztagebuchEintrag.mutateAsync({
        content: data.content,
        empfaenger: einheitenAsItems.find((item) => data.empfaenger === item.item.id)?.item?.funkrufname ?? data.empfaenger,
        absender: einheitenAsItems.find((item) => data.absender === item.item.id)?.item?.funkrufname ?? data.absender,
        timestamp: formatISO(new Date()), //todo timestamp from frontend
      });
    }}
    defaultValues={{
      timestamp: '',
      absender: einsatz?.data?.aufnehmendesRettungsmittelId ?? '',
      empfaenger: einsatztagebuchItem.item.id,
      content: '',
    }}
  />;
}