import { useEinsatztagebuch } from '../../../hooks/einsatztagebuch.hook.js';
import { GenericForm } from '../organisms/GenericForm.component.tsx';
import { useCallback } from 'react';
import { formatISO } from 'date-fns';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { z } from 'zod';
import { CreateEinsatztagebuchEintrag } from '../../../types/app/einsatztagebuch.types.js';
import { useEinheitenItems } from '../../../hooks/einheiten/einheiten-items.hook.js';

interface Props {
  closeForm: () => void;
}

export function EinsatztagebuchForm({ closeForm }: Props) {
  const { createEinsatztagebuchEintrag } = useEinsatztagebuch();
  const { einsatz } = useEinsatz();

  const { einheitenAsItems } = useEinheitenItems({
    include: ['einheitenImEinsatz', 'einheitenNichtImEinsatz'],
  });

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
        absender: '',
        empfaenger: einsatz?.data?.aufnehmendesRettungsmittelId ?? '',
        content: '',
      }}
    />
  );
}