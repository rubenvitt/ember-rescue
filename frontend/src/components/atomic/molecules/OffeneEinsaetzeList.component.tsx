import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useInterval } from '../../../hooks/functions.hook.js';
import { formatDate, formatDistanceToNow } from 'date-fns';
import { natoDateTime } from '../../../lib/time.js';
import { Badge } from '../../catalyst-components/badge.js';
import { Button } from '../../catalyst-components/button.tsx';
import { useEinheiten } from '../../../hooks/einheiten.hook.js';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';


export function OffeneEinsaetzeList() {
  const { offeneEinsaetze, saveEinsatz } = useEinsatz();
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
            <Menu as="div" className="relative flex-none">
              <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Optionen</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href="#"
                      className={clsx(
                        focus ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900',
                      )}
                    >
                      Abschließen<span className="sr-only">, {einsatz.label}</span>
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href="#"
                      className={clsx(
                        focus ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900',
                      )}
                    >
                      Leseansicht<span className="sr-only">, {einsatz.label}</span>
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href="#"
                      className={clsx(
                        focus ? 'bg-gray-50' : '',
                        'block px-3 py-1 text-sm leading-6 text-gray-900',
                      )}
                    >
                      Delete<span className="sr-only">, {einsatz.name}</span>
                    </a>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  );
}
