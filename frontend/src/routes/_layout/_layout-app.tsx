import { createFileRoute } from '@tanstack/react-router';
import React, { useMemo, useState } from 'react';
import {
  Bars3Icon,
  BookOpenIcon,
  HomeIcon,
  InformationCircleIcon,
  MapIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { UserProfileDropdown } from '../../components/atomic/molecules/UserProfileDropdown.js';
import { useTheme } from '../../hooks/theme.hook.js';
import { SidebarComponent } from '../../components/atomic/organisms/Sidebar.component.js';
import { useStore } from '../../hooks/store.hook.js';
import { useNetwork } from '@reactuses/core';
import { PiMagnifyingGlass, PiNotification, PiSignOut, PiSun, PiWifiHigh, PiWifiXBold } from 'react-icons/pi';
import { DropdownItemType } from '../../components/atomic/molecules/GenericDropdown.component.js';

export const Route = createFileRoute('/_layout/_layout-app')({
  component: LayoutApp,
});


const mainNavigation = [
  { name: 'Dashboard', href: '/app', icon: HomeIcon },
  { name: 'Einsatztagebuch', href: '/app/einsatztagebuch', icon: BookOpenIcon },
  { name: 'Einheiten', href: '/app/einheiten', icon: UserGroupIcon },
  { name: 'Patienten', href: '/app/patienten', icon: PlusIcon },
  { name: 'Lagekarte', href: '/app/lagekarte', icon: MapIcon },
  { name: 'Einsatzdaten', href: '/app/einsatzdaten', icon: InformationCircleIcon },
];

export function LayoutApp({ children }: React.PropsWithChildren<{}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toggleTheme } = useTheme();
  const { contextualNavigation } = useStore();
  const { online } = useNetwork();

  const userNavigation = useMemo<DropdownItemType[]>(() => {
    return [
      { text: 'Theme wechseln', onClick: toggleTheme, icon: PiSun },
      { text: 'Abmelden', to: '/auth/signout', icon: PiSignOut },
    ];
  }, []);

  return (
    <>
      <div>
        <SidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} navigation={mainNavigation}
                          contextualNavigation={contextualNavigation} />
        <div className="lg:pl-72">
          <div
            className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
                    onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <PiMagnifyingGlass
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm dark:bg-gray-900/80 dark:text-gray-200 dark:placeholder-gray-400"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6 text-gray-900 dark:text-gray-200">
                <div>{online ? <PiWifiHigh size={26} /> : <PiWifiXBold size={26} className="text-red-500" />}</div>
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <PiNotification className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                {/* Profile dropdown */}
                <UserProfileDropdown dropdownItems={userNavigation} />
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
