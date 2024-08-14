import React from 'react';
import { SidebarContentProps } from '../../../../types/ui/nav.types.js';
import { EinsatzInfoComponent } from '../../molecules/EinsatzInfo.component.js';
import { NavListComponent } from './NavList.component.js';
import { Cog6ToothIcon } from '@heroicons/react/24/outline/index.js';
import { WindowOptions, Windows } from '../../../../utils/window.js';
import { PiQuestion } from 'react-icons/pi';
import { useAppWindow } from '../../../../hooks/window.hook.js';

export const SidebarContentComponent: React.FC<SidebarContentProps> = ({ navigation, contextualNavigation }) => {
  const openAdmin = useAppWindow({ appWindow: Windows.ADMIN, windowOptions: WindowOptions.admin });
  const openDocs = useAppWindow({ appWindow: Windows.DOCS, windowOptions: WindowOptions.docs });

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 dark:bg-primary-950 px-6 pb-4">
      <EinsatzInfoComponent />
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <NavListComponent items={navigation} />
          {contextualNavigation && contextualNavigation.items.length > 0 && (
            <>
              <hr className="border-t border-gray-800" />
              <NavListComponent items={contextualNavigation.items} title={contextualNavigation.title} />
            </>
          )}
          <li className="mt-auto">
            <button
              onClick={() => {
                openAdmin();
              }}
              className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-primary-500 dark:hover:bg-primary-800"
            >
              <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Einstellungen
            </button>

            <button
              onClick={() => {
                openDocs();
              }}
              className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-primary-500 dark:hover:bg-primary-800"
            >
              <PiQuestion className="h-6 w-6 shrink-0" aria-hidden="true" />
              Hilfe
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};