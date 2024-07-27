import React from 'react';
import { SidebarContentProps } from '../../../../types/nav.types.js';
import { EinsatzInfoComponent } from '../../molecules/EinsatzInfo.component.js';
import { NavListComponent } from './NavList.component.js';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Cog6ToothIcon } from '@heroicons/react/24/outline/index.js';
import { Windows } from '../../../../utils/window.js';

export const SidebarContentComponent: React.FC<SidebarContentProps> = ({ navigation, contextualNavigation }) => (
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
              return new WebviewWindow(Windows.ADMIN, {
                url: '/admin',
                center: true,
                maximizable: false,
                minimizable: false,
                title: 'Admin-Tools',
              });
            }}
            className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-primary-500 dark:hover:bg-primary-800"
          >
            <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
            Einstellungen
          </button>
        </li>
      </ul>
    </nav>
  </div>
);