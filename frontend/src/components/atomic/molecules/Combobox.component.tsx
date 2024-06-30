import { useMemo, useState } from 'react';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Identifiable } from '../../../types.js';
import clsx from 'clsx';


export type ItemType<T extends Identifiable> = {
  label: string,
  secondary?: string,
  item: T | (T & Record<string, any>)
}

interface Props<T extends Identifiable> {
  items: ItemType<T>[],
  onChange: (id: string) => void,
  defaultItem?: ItemType<T>,
  label?: string,
}

export function ComboInput<T extends Identifiable>({ items, defaultItem, onChange, label }: Props<T>) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ItemType<T> | null>(defaultItem ?? null);

  const filteredItems = useMemo(() => {
    return query === '' ? items : items.filter((item) => (item.label + item.secondary).toLowerCase().includes(query.toLowerCase()));
  }, [query, items]);

  return (
    <Combobox
      as="div"
      value={selectedItem}
      onChange={(item) => {
        setQuery('');
        setSelectedItem(item);
        onChange(item?.item.id ?? '');
      }}
    >
      {label && <Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Label>}
      <div className={clsx('relative', label && ' mt-3.5')}>
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white pb-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={(item: ItemType<T>) => item?.label}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        {filteredItems.length > 0 && (
          <ComboboxOptions
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <ComboboxOption
                key={item.item.id}
                value={item}
                className={({ focus }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    focus ? 'bg-indigo-600 text-white' : 'text-gray-900',
                  )
                }
              >
                {({ focus, selected }) => (
                  <>
                    <div className="flex">
                      <span className={clsx('truncate', selected && 'font-semibold')}>{item.label}</span>
                      <span
                        className={clsx(
                          'ml-2 truncate text-gray-500',
                          focus ? 'text-indigo-200' : 'text-gray-500',
                        )}
                      >
                        {item.secondary}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          focus ? 'text-white' : 'text-indigo-600',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}

