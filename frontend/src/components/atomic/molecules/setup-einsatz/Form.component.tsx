import React, { useMemo } from 'react';
import { GenericForm } from '../../organisms/GenericForm.component.js';
import { useNavigate } from '@tanstack/react-router';
import { useAlarmstichworte } from '../../../../hooks/alarmstichworte.hook.js';
import { useEinsatz } from '../../../../hooks/einsatz.hook.js';
import { CreateEinsatz } from '../../../../types/types.ts';
import { format } from 'date-fns';
import { useEinheiten } from '../../../../hooks/einheiten/einheiten.hook.js';

export const SetupEinsatzForm: React.FC = () => {
  const navigate = useNavigate();

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