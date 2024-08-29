import { clsx } from 'clsx';
import { UserCircleIcon } from '@heroicons/react/20/solid';
import { PiAddressBook, PiAmbulance, PiCake, PiCheck, PiEye, PiFlag, PiMapPin, PiNote } from 'react-icons/pi';

// TODO[ant-design](rubeen, 26.08.24): use real data

export function BetroffeneDetail() {
  return (
    <div className="col-span-12 overflow-hidden bg-white dark:bg-gray-950/25 shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Patientenkarte</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Patient wurde angelegt (todo)</p>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Erkrankungen</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <p>Kategorie: ROT</p>
              <p>Verdachts-/Diagnose: Fraktur Oberschenkel</p>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Zugeordnetes Rettungsmittel</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">40-83-4</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function Patientenbox() {
  return (
    <div className="">
      <h2 className="sr-only">Summary</h2>
      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap px-4">
          <div className="flex-auto flex items-end px-6 pt-4">
            <dt className="sr-only">Status</dt>
            <dd className="mt-1 flex items-center gap-x-1.5">
              <div className="flex-none rounded-full bg-orange-500/20 p-1">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              </div>
              <p className="text-xs leading-5 text-gray-500 dark:text-gray-100">Gesichtet</p>
            </dd>
          </div>
          <div className="flex-none self-end pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-900 sr-only">Sichtungskategorie</dt>
            <div aria-label="Gelber Patient" className="h-12 w-12 flex-none rounded-full bg-red-500" />
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">Client</span>
              <UserCircleIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">Margot Foster</dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Alter</span>
              <PiCake aria-hidden="true" className="h-6 w-5 text-gray-400" />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">
              <time dateTime="2023-01-31">11.11.1999</time>
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Address</span>
              <PiMapPin aria-hidden="true" className="h-6 w-5 text-gray-400" />
            </dt>
            <dd className="text-sm leading-6 text-gray-500">Uelzener Twiete 11, 29525 Uelzen</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-gray-900/5 px-6 py-6 flex flex-col items-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Anpassen
          </a>
        </div>
      </div>
    </div>
  );
}

const timeline = [
  {
    id: 3,
    content: 'Patient wurde entlassen',
    target: '40-81-1',
    href: '#',
    date: 'Sep 28',
    datetime: '2020-09-28',
    icon: PiCheck,
    iconBackground: 'bg-green-500',
  },
  {
    id: 1,
    content: 'Patientendaten wurden an FüKW gemeldet',
    target: '40-12-1',
    href: '#',
    date: 'Sep 20',
    datetime: '2020-09-20',
    icon: PiNote,
    iconBackground: 'bg-gray-400',
  },
  {
    id: 2,
    content: 'Patient wurde aufgenommen',
    target: '40-83-1',
    href: '#',
    date: 'Sep 22',
    datetime: '2020-09-22',
    icon: PiAmbulance,
    iconBackground: 'bg-blue-500',
  },
  {
    id: 4,
    content: 'Patient wurde gesichtet, Kategorie ROT',
    target: '40-82-1',
    href: '#',
    date: 'Sep 30',
    datetime: '2020-09-30',
    icon: PiFlag,
    iconBackground: 'bg-red-500',
  },
  {
    id: 5,
    content: 'Patient aufgefunden',
    target: '40-82-1',
    href: '#',
    date: 'Oct 4',
    datetime: '2020-10-04',
    icon: PiEye,
    iconBackground: 'bg-orange-500',
  },
  {
    id: 6,
    content: 'Patient im System angelegt',
    target: '40-12-1',
    href: '#',
    date: 'Oct 4',
    datetime: '2020-10-04',
    icon: PiAddressBook,
    iconBackground: 'bg-gray-400',
  },
];

export function BetroffeneFeed() {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={clsx(
                      event.iconBackground,
                      'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
                    )}
                  >
                    <event.icon aria-hidden="true" className="h-5 w-5 text-white" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.content}{' '}
                      <a href={event.href} className="font-medium text-gray-900">
                        {event.target}
                      </a>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.datetime}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

