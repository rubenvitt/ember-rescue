import React, { useMemo } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline/index.js';
import clsx from 'clsx';
import { useLocation } from '@tanstack/react-router';
import { NavItem } from '../../../types/types.js';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { natoDateTime } from '../../../utils/time.js';
import { format } from 'date-fns';
import { useInterval } from '../../../hooks/functions.hook.js';
import FireAlarmIcon from '../../../assets/icons/icons8-fire-alarm.svg?react';
import { Link } from '../../deprecated/link.tsx';


interface NavItemProps {
  item: NavItem;
}

interface NavListProps {
  items: NavItem[];
  title?: string;
}

export interface ContextualNavigation {
  title: string;
  items: NavItem[];
}

interface SidebarContentProps {
  navigation: NavItem[];
  contextualNavigation?: ContextualNavigation;
}

interface MobileSidebarProps extends SidebarContentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

type DesktopSidebarProps = SidebarContentProps;

interface SidebarComponentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigation: Omit<NavItem, 'current'>[];
  contextualNavigation?: ContextualNavigation;
}

const NavItemComponent: React.FC<NavItemProps> = ({ item }) => (
  <li key={item.name}>
    <Link
      to={item.href}
      className={clsx(
        item.current
          ? 'bg-primary-200 text-gray-900 dark:bg-primary-900 dark:text-gray-200'
          : 'text-white hover:bg-primary-500 dark:hover:bg-primary-800',
        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
      )}
    >
      {'icon' in item && item.icon && <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />}
      {item.name}
    </Link>
  </li>
);

const NavList: React.FC<NavListProps> = ({ items, title }) => (
  <li>
    {title && <div className="text-xs font-semibold leading-6 text-white">{title}</div>}
    <ul role="list" className="-mx-2 mt-2 space-y-1">
      {items.map((item) => <NavItemComponent key={item.name} item={item} />)}
    </ul>
  </li>
);

const SidebarContent: React.FC<SidebarContentProps> = ({ navigation, contextualNavigation }) => {
  const { einsatz } = useEinsatz();
  const time = useInterval<string>(() => {
    return format(new Date(), natoDateTime);
  }, 300, []);

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 dark:bg-primary-950 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-start gap-4 mt-4">
        <FireAlarmIcon className="h-8 w-auto mt-1 text-white" />
        <div>
          <h3
            className="text-base font-bold leading-6 text-white">Laufend: {einsatz.data?.einsatz_alarmstichwort?.bezeichnung}</h3>
          <p className="-mt-0.5 text-sm text-gray-200">
            Beginn: {einsatz.data?.beginn && format(einsatz.data?.beginn, natoDateTime)}<br />
            Aktuell: {time}
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <NavList items={navigation} />
          {contextualNavigation && contextualNavigation.items.length > 0 &&
            <>
              <hr className="border-t border-gray-800" />
              <NavList items={contextualNavigation.items} title={contextualNavigation.title} />
            </>
          }
          <li className="mt-auto">
            <button
              onClick={() => {
                // open new window
                new WebviewWindow('admin', {
                  url: '/admin',
                  center: true,
                  maximizable: false,
                  minimizable: false,
                  title: 'Admin-Tools',
                });
              }}
              className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-primary-500 dark:hover:bg-primary-800">
              <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Einstellungen
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// noinspection RequiredAttributes (TransitionChild)
const MobileSidebar: React.FC<MobileSidebarProps> = ({
                                                       sidebarOpen,
                                                       setSidebarOpen,
                                                       navigation,
                                                       contextualNavigation,
                                                     }) => (
  <Dialog className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-gray-900/80 transition-opacity duration-100 ease-linear data-[closed]:opacity-0"
    />
    <div className="fixed inset-0 flex">
      <DialogPanel
        transition
        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-100 ease-in-out data-[closed]:-translate-x-full"
      >
        <TransitionChild>
          <div
            className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-100 ease-in-out data-[closed]:opacity-0">
            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
              <span className="sr-only">Sidebar schließen</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </TransitionChild>
        <SidebarContent navigation={navigation} contextualNavigation={contextualNavigation} />
      </DialogPanel>
    </div>
  </Dialog>
);

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ navigation, contextualNavigation }) => (
  <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <SidebarContent navigation={navigation} contextualNavigation={contextualNavigation} />
  </div>
);

export const SidebarComponent: React.FC<SidebarComponentProps> = ({
                                                                    sidebarOpen,
                                                                    setSidebarOpen,
                                                                    navigation: _navigation,
                                                                    contextualNavigation,
                                                                  }) => {
  const { pathname } = useLocation();
  const navigation = useMemo(() => {
    return _navigation.map(item => ({ ...item, current: item.href === pathname }));
  }, [_navigation, pathname]);

  return (
    <>
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        contextualNavigation={contextualNavigation}
      />
      <DesktopSidebar navigation={navigation} contextualNavigation={contextualNavigation} />
    </>
  );
};