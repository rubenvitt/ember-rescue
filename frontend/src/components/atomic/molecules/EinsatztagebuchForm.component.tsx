import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { CreateEinsatztagebuchEintrag, EinheitDto } from '../../../types/types.js';
import { GenericForm } from '../organisms/GenericForm.component.tsx';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { useCallback, useMemo } from 'react';
import { formatISO } from 'date-fns';
import { ItemType } from './Combobox.component.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { z } from 'zod';

interface Props {
  closeForm: () => void;
}

const einsatztagebuchItem: ItemType<EinheitDto> = {
  item: {
    id: 'etb',
    einheitTyp: { id: 'etb', label: 'ETB' },
    kapazitaet: 0,
    istTemporaer: false,
    status: { id: 'none', code: 'none', bezeichnung: 'None' },
    funkrufname: 'Einsatztagebuch',
    _count: { einsatz_einheit: 0 },
  },
  label: 'ETB',
  secondary: 'Einsatztagebuch',
};

export function EinsatztagebuchForm({ closeForm }: Props) {
  const { createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const { einheiten } = useEinheiten();
  const { einsatz } = useEinsatz();

  const einheitenAsItems = useMemo<ItemType<EinheitDto>[]>(() => [
    einsatztagebuchItem,
    ...(einheiten.data?.map(item => ({
      label: item.funkrufname,
      secondary: item.einheitTyp.label,
      item,
    })) ?? []),
  ], [einheiten.data]);

  const handleSubmit = useCallback(async (data: CreateEinsatztagebuchEintrag) => {
    closeForm();
    await createEinsatztagebuchEintrag.mutateAsync({
      content: data.content,
      empfaenger: einheitenAsItems.find((item) => data.empfaenger === item.item.id)?.item?.funkrufname ?? data.empfaenger,
      absender: einheitenAsItems.find((item) => data.absender === item.item.id)?.item?.funkrufname ?? data.absender,
      timestamp: formatISO(new Date()), // TODO: timestamp from frontend
    });
  }, [closeForm, createEinsatztagebuchEintrag]);

  return (
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
            validators: {
              onChange: z.string({ message: 'Es sollte ein Absender angegeben werden' }),
            },
          },
          {
            name: 'empfaenger',
            label: 'Empfänger',
            type: 'combo',
            width: 'half',
            items: einheitenAsItems,
            validators: {
              onChange: z.string({ message: 'Es sollte ein Absender angegeben werden' }),
            },
          },
          {
            name: 'content',
            label: 'Inhalt',
            width: 'full',
            type: 'textarea',
            validators: {
              onBlur: z.string().trim().min(1, { message: 'Ein ETB-Eintrag benötigt eine Nachricht.' }),
            },
          },
        ],
      }]}
      onSubmit={handleSubmit}
      defaultValues={{
        timestamp: '',
        absender: einsatz?.data?.aufnehmendesRettungsmittelId ?? '',
        empfaenger: einsatztagebuchItem.item.id,
        content: '',
      }}
    />
  );
}