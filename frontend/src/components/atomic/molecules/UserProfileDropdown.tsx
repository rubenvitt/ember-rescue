import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid/index.js';
import clsx from 'clsx';
import { Link } from '@tanstack/react-router';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { NavItems } from '../../../types.js';

export function UserProfileDropdown({ menuItems }: { menuItems: NavItems }) {
  const { bearbeiter } = useBearbeiter();

  return <Menu as="div" className="relative">
    <MenuButton className="flex items-center p-1.5">
      <span className="sr-only">Open user menu</span>
      <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        {bearbeiter?.name}
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
    </MenuButton>
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      {menuItems.map((item) => (
        <MenuItem key={item.name}>
          {({ focus }) => (
            <Link
              to={item.href}
              className={clsx(
                focus ? 'bg-gray-50' : '',
                'block px-3 py-1 text-sm leading-6 text-gray-900',
              )}
            >
              {item.name}
            </Link>
          )}
        </MenuItem>
      ))}
    </MenuItems>
  </Menu>;
}
