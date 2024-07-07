import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { GenericForm } from '../components/atomic/organisms/GenericForm.component.js';
import { format } from 'date-fns';
import { useEinheiten } from '../hooks/einheiten.hook.js';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEinsatz } from '../hooks/einsatz.hook.js';
import { OffeneEinsaetzeList } from '../components/atomic/organisms/OffeneEinsaetzeList.component.js';
import { useMemo } from 'react';
import { useAlarmstichworte } from '../hooks/alarmstichworte.hook.js';
import { ItemType } from '../components/atomic/molecules/Combobox.component.js';
import { Alarmstichwort } from '../types.js';

export const Route = createLazyFileRoute('/setupEinsatz')({
  component: SetupEinsatz,
  pendingComponent: () => <div>Loading...</div>,
});

interface Einsatz {
  erstAlarmiert: string;
  alarmstichwort?: string;
  aufnehmendesRettungsmittel?: string;
  einsatznummer?: string;
}

function SetupEinsatz() {
  const { einheiten } = useEinheiten();
  const { removeBearbeiter, bearbeiter } = useBearbeiter();
  const navigate = useNavigate({ from: '/setupEinsatz' });
  const { createEinsatz, offeneEinsaetze, einsatz, saveEinsatz } = useEinsatz();
  const einsatzOffen = useMemo(() => offeneEinsaetze.data && offeneEinsaetze.data.length > 0, [offeneEinsaetze.data]);
  const { alarmstichworte } = useAlarmstichworte();
  const alarmstichworteItems = useMemo<ItemType<Alarmstichwort>[]>(() => alarmstichworte.data?.map(item => {
    return ({
      item,
      label: item.bezeichnung,
      secondary: item.beschreibung,
    });
  }) ?? [], [alarmstichworte.data]);


  if (!einheiten.isFetched) {
    return 'Loading...';
  }
  if (einsatz.isFetched && einsatz.data) {
    navigate({ to: '/app/' });
  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex gap-4 flex-col items-center min-h-screen">
      <div className="w-full max-w-6xl flex flex-col gap-16 space-y-16 divide-y divide-gray-900/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 sm:pt-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Einsatz
              anlegen{einsatzOffen && ' | fortsetzen'}</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Anlegen eines neuen Einsatzes
              ({bearbeiter.data?.name}){einsatzOffen && ' - es existieren offene Einsätze'}
            </p>
          </div>
        </div>

        {
          einsatzOffen &&
          <div className="w-full">
            <OffeneEinsaetzeList />
          </div>
        }
        <section id="newEinsatzForm" className="w-full pb-6">
          <GenericForm<Einsatz>
            layout="complex"
            resetText="Abbrechen"
            submitText="Einsatz erstellen"
            onReset={() => {
              removeBearbeiter();
              navigate({ to: '/signin' });
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
                  items: einheiten.data!!.map((einheit) => ({
                    item: einheit,
                    label: einheit.funkrufname,
                    secondary: einheit.typ,
                  })),
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
      </div>
    </div>
  );
}