import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import { natoDateTime } from '../../../utils/time.js';
import { twMerge } from 'tailwind-merge';

// TODO[ant-design](rubeen, 26.08.24): implement with real data

const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: null,
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    active: true,
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
    lastSeen: null,
  },
];

// TODO[ant-design](rubeen, 26.08.24): use ant dataList
export function BetroffeneList() {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 ring-gray-900/5 dark:divide-gray-700 dark:bg-gray-950/25"
    >
      {people.map((person) => (
        <li
          key={person.email}
          className={twMerge(
            'relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 dark:hover:bg-gray-950',
            person.active && 'bg-blue-300 hover:bg-blue-400 dark:bg-blue-950',
          )}
        >
          <div className="flex min-w-0 gap-x-4">
            <div aria-label="Gelber Patient" className="h-12 w-12 flex-none rounded-full bg-red-500" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                <a href={person.href}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  #1
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500 dark:text-gray-100">In Behandlung</p>
              {person.lastSeen ? (
                <dl className="mt-1 text-xs leading-5 text-gray-500">
                  <dt>Erstkontakt</dt>
                  <dd>
                    <time dateTime={person.lastSeenDateTime}>{format(person.lastSeenDateTime, natoDateTime)}</time>
                  </dd>
                </dl>
              ) : (
                <></>
              )}
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-orange-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                </div>
                <p className="text-xs leading-5 text-gray-500 dark:text-gray-100">Gesichtet</p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900 dark:text-white"></p>
            </div>
            {person.active && <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />}
          </div>
        </li>
      ))}
    </ul>
  );
}
