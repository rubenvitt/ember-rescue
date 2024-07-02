import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { GenericForm } from '../components/atomic/organisms/GenericForm.component.js';
import { format } from 'date-fns';
import { useEinheiten } from '../hooks/einheiten.hook.js';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEinsatz } from '../hooks/einsatz.hook.js';
import { OffeneEinsaetzeList } from '../components/atomic/molecules/OffeneEinsaetzeList.component.js';

export const Route = createLazyFileRoute('/setupEinsatz')({
  component: SetupEinsatz,
  pendingComponent: () => <div>Loading...</div>,
});

interface Einsatz {
  erstAlarmiert: string;
  einsatzstichwort?: string;
  aufnehmendesRettungsmittel?: string;
  einsatznummer?: string;
}

function SetupEinsatz() {
  const { einheiten } = useEinheiten();
  const { removeBearbeiter } = useBearbeiter();
  const navigate = useNavigate({ from: '/setupEinsatz' });
  const { createEinsatz, offeneEinsaetze, einsatz } = useEinsatz();

  if (!einheiten.data) {
    return 'Loading...';
  }
  if (einsatz) {
    navigate({ to: '/app/' });
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex gap-4 flex-col">
      {
        offeneEinsaetze.data && offeneEinsaetze.data?.length > 0 &&
        <div className="flex flex-col items-center">
          <div className="h-24 w-full bg-red-800"></div>
          <div className="max-w-4xl">
            <h2>Offene Einsätze vorhanden</h2>
            <OffeneEinsaetzeList />
          </div>
        </div>
      }
      <GenericForm<Einsatz>
        onReset={() => {
          removeBearbeiter();
          navigate({ to: '/signin' });
        }}
        onSubmit={async (values) => {
          await createEinsatz.mutateAsync(values);
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
                onChange: ({ value }) => {
                  console.log(value);
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
              name: 'einsatzstichwort',
              label: 'Einsatzstichwort der Alarmierung',
              type: 'combo',
              items: [
                {
                  item: {
                    id: '1', // TODO: Remove this
                    name: 'B1',
                  },
                  label: 'B1',
                  secondary: 'Brand 1',
                },
                {
                  item: {
                    id: '2',
                    name: 'B2',
                    secondary: 'Brand 2',
                  },
                  label: 'B2',
                },
                {
                  item: {
                    id: '21',
                    name: 'B2Y',
                  },
                  label: 'B2Y',
                  secondary: 'Brand 2 (Menschenleben in Gefahr)',
                },
                {
                  item: {
                    id: '3',
                    name: 'B3',
                  },
                  label: 'B3',
                  secondary: 'Brand 3',
                },
                {
                  item: {
                    id: '4',
                    name: 'B3Y',
                  },
                  label: 'B3Y',
                  secondary: 'Brand 3 (Menschenleben in Gefahr)',
                },
              ],
            },
          ],
          title: 'Alarmierung',
          description: 'Informationen zur Alarmierung',
        },
      ]} />
    </div>
  );
}