import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { create } from 'zustand';
import { useNavigate } from '@tanstack/react-router';
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
import { PiEmpty } from 'react-icons/pi';
import { navigation, userNavigation } from '../molecules/Navigation.js';
import { MenuItem } from '../../../types/ui/menu.types.js';
import { useTheme } from '../../../hooks/theme.hook.js';
import { MenuItemType } from 'antd/lib/menu/interface.js';

// Types
type CommandPaletteStore = {
  isOpen: boolean;
  rawQuery: string;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  setRawQuery: (query: string) => void;
};

type CommandItem = {
  id: React.Key;
  name: string;
  icon?: React.ReactNode;
  onClick?: (info?: any) => void;
  url?: string;
  type: 'navigation' | 'action' | 'help';
};

// Store
export const useCommandPalette = create<CommandPaletteStore>((set) => ({
  isOpen: false,
  rawQuery: '',
  openPalette: () => set({ isOpen: true }),
  closePalette: () => set({ isOpen: false, rawQuery: '' }),
  togglePalette: () => set((state) => ({ isOpen: !state.isOpen, rawQuery: '' })),
  setRawQuery: (query: string) => set({ rawQuery: query }),
}));

// Helper functions
const extractNavigationItems = (items: MenuItem[], groupName: ReactNode = ''): CommandItem[] => {
  // @ts-ignore
  return items.flatMap((item: MenuItem) => {
    if (!item) return [];
    if (item.type === 'item') {
      return [
        {
          id: item.key,
          name: groupName ? `${groupName} / ${item.label}` : item.label,
          icon: item.icon,
          onClick: item.onClick,
          type: 'navigation',
        },
      ];
    } else if ((item.type === 'submenu' || item.type === 'group') && item.children?.length) {
      return extractNavigationItems(item.children, item.label);
    }
    return [];
  });
};

const filterItems = (items: CommandItem[], query: string): CommandItem[] => {
  return items.filter((item) => item.name?.toLowerCase().includes(query.toLowerCase()));
};

// Components
const NoResultsFound: React.FC = () => (
  <div className="px-6 py-14 text-center text-sm sm:px-14">
    <PiEmpty className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
    <p className="mt-4 font-semibold text-gray-900">Keine Ergebnisse verfügbar</p>
    <p className="mt-2 text-gray-500">Zu diesem Suchbegriff konnte nichts gefunden werden. Bitte erneut versuchen.</p>
  </div>
);

const HelpContent: React.FC = () => (
  <div className="px-6 py-14 text-center text-sm sm:px-14">
    <LifebuoyIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
    <p className="mt-4 font-semibold text-gray-900">Hilfe beim Suchen</p>
    <p className="mt-2 text-gray-500">
      Die Command Bar hilft, um schnell in der App zu navigieren oder Dinge auszuführen. Erreichbar über den Shortcut
      STRG (Mac: CMD) + K.
    </p>
  </div>
);

const ShortcutKey: React.FC<{ children: React.ReactNode; active: boolean }> = ({ children, active }) => (
  <kbd
    className={`mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2 ${
      active ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900'
    }`}
  >
    {children}
  </kbd>
);

const CommandList: React.FC<{ items: CommandItem[]; title: string }> = ({ items, title }) => {
  if (items.length === 0) return null; // Wenn keine Items vorhanden sind, wird nichts gerendert

  return (
    <div className="py-2">
      <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      <ul className="text-sm text-gray-700">
        {items.map((item) => (
          <ComboboxOption
            as="li"
            key={item.id}
            value={item}
            className="flex cursor-default select-none items-center px-4 py-2 data-[focus]:bg-indigo-600 data-[focus]:text-white"
          >
            {item.icon && (
              <span className="mr-3 flex-shrink-0 text-gray-400 group-data-[focus]:text-white">{item.icon}</span>
            )}
            <span className="flex-auto truncate">{item.name}</span>
          </ComboboxOption>
        ))}
      </ul>
    </div>
  );
};

function useActions() {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  // @ts-ignore
  const userItems = useMemo<CommandItem[]>(() => userNavigation(navigate, toggleTheme).map((item: MenuItemType) => ({
      id: item!.key,
      name: item!.label,
      icon: item!.icon,
      onClick: item!.onClick,
      type: 'action',
    })),
    [navigate, toggleTheme],
  );

  useEffect(() => {
    console.log('userItems are', userItems);
  }, [userItems]);

  return { actionItems: [...userItems] };
}

// Main Component
export function CommandPalette() {
  const { isOpen, togglePalette, closePalette, rawQuery, setRawQuery } = useCommandPalette();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const navigationItems = useMemo(() => extractNavigationItems(navigation(navigate)), [navigate]);
  const { actionItems } = useActions();

  // TODO: Add more item types here (e.g., actions, help items)
  const allItems = useMemo(() => [...navigationItems, ...actionItems], [navigationItems, actionItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        togglePalette();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePalette]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const query = rawQuery.toLowerCase().replace(/^[#>]/, '');
    if (rawQuery === '>') return navigationItems;
    if (query === '' || rawQuery.startsWith('#')) return [];
    return filterItems(allItems, query);
  }, [rawQuery, navigationItems, allItems]);

  const handleChange = (item: CommandItem) => {
    if (item.url) {
      closePalette();
      window.location.href = item.url;
    } else if (item.onClick) {
      closePalette();
      item.onClick();
    }
  };

  return (
    <Dialog className="relative z-50" open={isOpen} onClose={closePalette}>
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
          <Combobox onChange={handleChange}>
            <div className="relative">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <ComboboxInput
                ref={inputRef}
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search..."
                onChange={(event) => setRawQuery(event.target.value)}
              />
            </div>

            {filteredItems.length > 0 && (
              <ComboboxOptions static className="max-h-80 scroll-py-2 divide-y divide-gray-100 overflow-y-auto">
                <CommandList items={filteredItems.filter((item) => item.type === 'navigation')} title="Navigation" />
                <CommandList items={filteredItems.filter((item) => item.type === 'action')} title="Aktionen" />
                <CommandList items={filteredItems.filter((item) => item.type === 'help')} title="Hilfe" />
              </ComboboxOptions>
            )}
            {rawQuery === '?' && <HelpContent />}
            {rawQuery !== '?' && filteredItems.length === 0 && <NoResultsFound />}

            <div className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-700">
              Tippe <ShortcutKey active={rawQuery.startsWith('>')}>{'>'}</ShortcutKey> <span>für Navigation,</span>
              <ShortcutKey active={rawQuery.startsWith('#')}>{'#'}</ShortcutKey> für Aktionen und{' '}
              <ShortcutKey active={rawQuery === '?'}>{'?'}</ShortcutKey> für Hilfe.
            </div>
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
