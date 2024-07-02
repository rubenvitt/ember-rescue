import { ArchiveBoxArrowDownIcon, EyeIcon } from '@heroicons/react/20/solid';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useInterval } from '../../../hooks/functions.hook.js';
import { formatDate, formatDistanceToNow } from 'date-fns';
import { natoDateTime } from '../../../lib/time.js';
import { Badge } from '../../catalyst-components/badge.js';
import { Button } from '../../catalyst-components/button.tsx';
import { useEinheiten } from '../../../hooks/einheiten.hook.js';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { Dropdown } from '../atoms/Dropdown.component.js';
import { FlexibleDialog } from './Dialog.js';


export function OffeneEinsaetzeList() {
  const { offeneEinsaetze, saveEinsatz, einsatzAbschliessen } = useEinsatz();
  const { einheiten } = useEinheiten();
  const { allBearbeiter } = useBearbeiter();

  const offeneEinsaetzeDisplay = useInterval(() => {
    return offeneEinsaetze.data?.map((einsatz) => ({
      ...einsatz,
      beginnToNow: formatDistanceToNow(einsatz.beginn),
      updatedToNow: formatDistanceToNow(einsatz.updatedAt),
      label: einsatz.einsatz_alarmstichwort?.bezeichnung + ' - ' + formatDate(einsatz.beginn, natoDateTime),
      einheit: einheiten.data?.find(value => value.id === einsatz.aufnehmendesRettungsmittelId)?.funkrufname,
      bearbeiter: allBearbeiter.data?.find(value => value.id === einsatz.bearbeiterId)?.name,
    }));
  }, 10000, [offeneEinsaetze.data, einheiten.data]);

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {offeneEinsaetzeDisplay?.map((einsatz) => (
        <li key={einsatz.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p
                className="text-sm font-semibold leading-6 text-gray-900">{einsatz.einsatz_alarmstichwort?.bezeichnung} (erstellt
                vor {einsatz.beginnToNow})</p>
              <Badge color="blue">Lokaler Einsatz</Badge>
              <Badge color="orange">Remote Einsatz</Badge>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">
                Beginn des Einsatzes: <time dateTime={einsatz.beginn}>{formatDate(einsatz.beginn, natoDateTime)}</time>
              </p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="truncate">Erstellt
                von {einsatz.bearbeiter}</p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="truncate">Aufgenommen
                durch {einsatz.einheit}</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <Button onClick={() => {
              saveEinsatz(einsatz);
            }} className="cursor-pointer" color="white">Einsatz öffnen <span
              className="sr-only">, {einsatz.label}</span></Button>
            <FlexibleDialog
              variant="critical"
              size="md"
              actions={[
                { label: 'Abbrechen' },
                {
                  onClick: () => einsatzAbschliessen.mutate(einsatz),
                  label: 'Einsatz archivieren',
                  variant: 'error',
                  primary: true,
                },
              ]}
              message="Der Einsatz wird archiviert und in den Read-Only Modus versetzt. Dies kann nicht rückgängig gemacht werden. Der Einsatz wird in dieser Ansicht versteckt."
              title="Laufenden Einsatz wirklich archivieren?"
            >
              {({ open }) => (
                <Dropdown buttonText="Optionen" minimal={true} items={[[
                  {
                    text: 'Abschließen', icon: ArchiveBoxArrowDownIcon, onClick: () => {
                      open();
                    },
                  },
                  { text: 'Leseansicht', to: '/app', icon: EyeIcon },
                ]]} />
              )}
            </FlexibleDialog>
          </div>
        </li>
      ))}
    </ul>
  );
}
