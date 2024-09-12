'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { LifebuoyIcon } from '@heroicons/react/24/outline';
import { ReactNode, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { create } from 'zustand';
import { navigation } from '../molecules/Navigation.js';
import { useNavigate } from '@tanstack/react-router';
import { MenuItem } from '../../../types/ui/menu.types.js';
import { PiEmpty } from 'react-icons/pi';

type CommandPaletteStore = {
  openPalette: () => void,
  closePalette: () => void,
  togglePalette: () => void,
  isOpen: boolean,
  rawQuery: string,
  setRawQuery: (query: string) => void,
}

export const useCommandPalette = create<CommandPaletteStore>((set, get) => ({
  isOpen: false,
  closePalette: () => set({ isOpen: false, rawQuery: '' }),
  openPalette: () => set({ isOpen: true }),
  togglePalette: () => set({ isOpen: !get().isOpen, rawQuery: '' }),
  rawQuery: '',
  setRawQuery: (query: string) => set({ rawQuery: query }),
}));

export function CommandPalette() {
  const { isOpen, togglePalette, closePalette, rawQuery, setRawQuery } = useCommandPalette();
  const query = rawQuery.toLowerCase().replace(/^[#>]/, '');
  const navigate = useNavigate();

  useEffect(() => {
    const keyEvent = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        togglePalette();
      }
    };
    document.addEventListener('keydown', keyEvent);
    return () => document.removeEventListener('keydown', keyEvent);
  }, []);

  const navigationItems = useMemo(() => {
    const extractItems = (items: MenuItem[], groupName: string | undefined | ReactNode = ''): any[] => {
      return items.flatMap((item: MenuItem) => {
        if (!item) {
          return undefined;
        }
        if (item.type === 'item') {
          return {
            id: item.key,
            name: groupName ? `${groupName} / ${item.label}` : item.label,
            icon: item.icon,
            onClick: item.onClick,
          };
        } else if ((item.type === 'submenu' || item.type === 'group') && (item.children?.length ?? 0) > 0) {
          return extractItems(item.children ?? [], item.label);
        } else {
          return [];
        }
      }).filter(item => item);
    };

    return extractItems(navigation(navigate));
  }, [navigate]);


  const filteredNavigationItems =
    rawQuery === '>'
      ? navigationItems
      : query === '' || rawQuery.startsWith('#')
        ? []
        : navigationItems.filter((item) => item.name.toLowerCase().includes(query),
        );

  return (
    <Dialog
      className="relative z-50"
      open={isOpen}
      onClose={() => {
        closePalette();
        setRawQuery('');
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <Combobox
            onChange={(item: { url?: string; onClick?: () => void }) => {
              if (item?.url) {
                closePalette();
                window.location.href = item.url;
              } else if (item?.onClick) {
                closePalette();
                item.onClick();
              }
            }}
          >
            <div className="relative">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <ComboboxInput
                autoFocus
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search..."
                onChange={(event) => setRawQuery(event.target.value)}
                onBlur={() => setRawQuery('')}
              />
            </div>

            {(filteredNavigationItems.length > 0 /* INSERT OTHER TYPES HERE WITH '|| filteredList.length > 0' */) && (
              <ComboboxOptions
                static
                as="ul"
                className="max-h-80 transform-gpu scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
              >
                {filteredNavigationItems.length > 0 && (
                  <li>
                    <h2 className="text-xs font-semibold text-gray-900">Navigation Items</h2>
                    <ul className="-mx-4 mt-2 text-sm text-gray-700">
                      {filteredNavigationItems.map((item) => (
                        <ComboboxOption
                          as="li"
                          key={item!!.id}
                          value={item}
                          className="flex cursor-default select-none items-center px-4 py-2 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                        >
                          {item!!.icon && <span>{item!!.icon}</span>}
                          <span className="ml-3 flex-auto truncate">{item!!.name}</span>
                        </ComboboxOption>
                      ))}
                    </ul>
                  </li>
                )}
              </ComboboxOptions>
            )}

            {rawQuery === '?' && (
              <div className="px-6 py-14 text-center text-sm sm:px-14">
                <LifebuoyIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                <p className="mt-4 font-semibold text-gray-900">Hilfe beim Suchen</p>
                <p className="mt-2 text-gray-500">
                  Verwenden Sie dieses Tool, um schnell nach Benutzern und Projekten in unserer gesamten Plattform zu
                  suchen. Sie können auch die Suchmodifikatoren unten im Footer verwenden, um die Ergebnisse nur auf
                  Benutzer oder Projekte zu beschränken.
                </p>
              </div>
            )}

            {query !== '' && rawQuery !== '?' === 0 && filteredNavigationItems.length === 0 && /* INSERT MORE ITEMS HERE */ (
              <div className="px-6 py-14 text-center text-sm sm:px-14">
                <PiEmpty className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                <p className="mt-4 font-semibold text-gray-900">Keine Ergebnisse verfügbar</p>
                <p className="mt-2 text-gray-500">Zu diesem Suchbegriff konnte nichts gefunden werden. Bitte erneut
                  versuchen.</p>
              </div>
            )}

            <div className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-700">
              Tippe{' '}
              <kbd
                className={clsx(
                  'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                  rawQuery.startsWith('#') ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900',
                )}
              >
                &gt;
              </kbd>{' '}
              <span>für Navigation,</span>
              <kbd
                className={clsx(
                  'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                  rawQuery.startsWith('>') ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900',
                )}
              >
                #
              </kbd>{' '}
              für Aktionen und{' '}
              <kbd
                className={clsx(
                  'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                  rawQuery === '?' ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900',
                )}
              >
                ?
              </kbd>{' '}
              für Hilfe.
            </div>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
