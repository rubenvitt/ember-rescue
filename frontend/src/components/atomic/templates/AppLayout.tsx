import React, { useMemo, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { UserProfileMenu } from '../molecules/UserProfileMenu.component.js';
import { useTheme } from '../../../hooks/theme.hook.js';
import { SidebarComponent } from './Sidebar.component.js';
import { PiNotification, PiNotificationBold, PiRabbit, PiSpinner } from 'react-icons/pi';
import { twMerge } from 'tailwind-merge';
import { CommandPalette, useCommandPalette } from '../organisms/CommandPalette.component.js';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';
import { useNavigate } from '@tanstack/react-router';
import { MenuItem } from '../../../types/ui/menu.types.js';
import { Dropdown } from 'antd';
import { useReminders } from '../../../hooks/reminders.hook.js';
import { ButtonWithShortcut } from '../atoms/ButtonWithShortcut.component.js';
import { userNavigation } from '../molecules/Navigation.js';

export function AppLayout({ children }: React.PropsWithChildren<{}>) {
  useBearbeiter({ requireBearbeiter: true });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const notificationCenter = useNotificationCenter();
  const unreadNotification = notificationCenter.unreadCount; // TODO implement me
  const navigate = useNavigate();
  useReminders();
  const { openPalette } = useCommandPalette();

  const userNav = useMemo<MenuItem[]>(() => userNavigation(navigate, toggleTheme), [navigate, toggleTheme]);

  return (
    <div>
      <CommandPalette />
      <SidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed} />
      <div className={twMerge('transition-all duration-300 ease-in-out', isCollapsed ? 'lg:pl-16' : 'lg:pl-72')}>
        <div
          className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-900/80">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          {/* Separator */}
          <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <ButtonWithShortcut
                shortcut={
                  navigator.platform.toUpperCase().indexOf('MAC') >= 0
                    ? '⌘ K'
                    : 'STRG K' /*TODO: this one is deprecated, need replacement*/
                }
                id="search-field"
                onClick={openPalette}
                icon={<PiRabbit className="h-6 w-6" />}
                type="text"
                className="flex h-full w-full items-center justify-start bg-transparent"
                name="search"
              >
                Schnellzugriff
              </ButtonWithShortcut>
            </form>
            <div className="flex items-center gap-x-4 text-gray-900 lg:gap-x-6 dark:text-gray-200">
              {(queryClient.isMutating() > 0 || queryClient.isFetching() > 0) && (
                <PiSpinner size={14} className={queryClient.isMutating() > 0 ? 'animate-ping' : 'animate-spin'} />
              )}
              <Dropdown
                menu={{
                  items: notificationCenter.notifications.map((value) => ({
                    label: (
                      <p className={value.read ? '' : 'bg-green-400'}>
                        {(value.content as string | undefined)?.slice(0, 100)}
                      </p>
                    ),
                    onClick: () => {
                      notificationCenter.markAsRead(value.id);
                    },
                    key: value.id,
                  })),
                }}
              >
                <button
                  type="button"
                  className={twMerge(
                    '-m-2.5 p-2.5 text-gray-400 hover:text-gray-500',
                    unreadNotification && 'animate-ping text-primary-500 hover:animate-none',
                  )}
                >
                  <span className="sr-only">View notifications</span>
                  {unreadNotification ? (
                    <PiNotificationBold className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <PiNotification className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </Dropdown>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

              {/* Profile dropdown */}
              <UserProfileMenu dropdownItems={userNav} />
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 dark:text-white">{children}</div>
        </main>
      </div>
    </div>
  );
}
