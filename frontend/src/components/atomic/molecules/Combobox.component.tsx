import React, { useEffect, useMemo, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react';
import { Identifiable } from '../../../types/types.js';
import clsx from 'clsx';
import { PiCaretDownLight, PiCheck, PiPlus } from 'react-icons/pi';
import { ValidationError } from '@tanstack/react-form';
import { cva } from 'class-variance-authority';
import { useValidation } from '../../../hooks/validation.hook.js';

const comboboxStyles = cva('w-full rounded-md border-0 bg-white pb-1.5 pl-3 pr-12 text-gray-900 dark:text-white dark:bg-gray-900/80 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6', {
  variants: {
    hasErrors: {
      true: 'ring-red-500 focus:ring-red-500 placeholder:text-red-300 text-red-900',
      false: 'ring-gray-300 focus:ring-primary-600',
    },
  },
});

export type ItemType<T extends Identifiable> = {
  label: string,
  secondary?: string,
  item: T | (T & Record<string, any>)
}

interface Props<T extends Identifiable> {
  items: ItemType<T>[],
  onChange: (id: string | null) => void,
  defaultItem?: ItemType<T>,
  label?: string,
  disabled?: boolean,
  allowNewValues?: boolean,
  onAddNewValue?: (newValue: string) => void,
  addValueLabel?: string,
  errors?: ValidationError[],
  inputProps?: Pick<React.ComponentPropsWithoutRef<'input'>, 'name' | 'onBlur' | 'required' | 'placeholder'>
}

export function ComboInput<T extends Identifiable>({
                                                     items,
                                                     defaultItem,
                                                     onChange,
                                                     label,
                                                     disabled,
                                                     allowNewValues = false,
                                                     onAddNewValue,
                                                     addValueLabel = 'Neuen Wert hinzufügen:',
                                                     errors,
                                                     inputProps,
                                                   }: Readonly<Props<T>>) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ItemType<T> | null>(defaultItem ?? null);
  const [pendingNewItem, setPendingNewItem] = useState<string | null>(null);
  const { hasErrors } = useValidation(errors);

  useEffect(() => {
    if (!selectedItem && defaultItem && query === '') {
      setSelectedItem(defaultItem);
    }
  }, [defaultItem, selectedItem, query]);

  const filteredItems = useMemo(() => {
    return query === '' ? items : items.filter((item) => (item.label + item.secondary).toLowerCase().includes(query.toLowerCase()));
  }, [query, items]);

  const handleChange = (item: ItemType<T> | string | null) => {
    setQuery('');
    if (!item) {
      setPendingNewItem(null);
      setSelectedItem(null);
      onChange(null);
      return;
    }
    if (typeof item === 'string') {
      // This is a new value
      if (onAddNewValue) {
        onAddNewValue(item);
      }
      setPendingNewItem(item);
      onChange(item);
    } else {
      setPendingNewItem(null); // Clear pending item if an existing item is selected
      setSelectedItem(item);
      onChange(item.item.id);
    }
  };

  const displayValue = (item: ItemType<T>) => {
    if (pendingNewItem) {
      return pendingNewItem;
    }
    return item?.label ?? '';
  };

  return (
    <Combobox
      as="div"
      disabled={disabled}
      value={selectedItem}
      onChange={handleChange}
    >
      {label && <Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">{label}</Label>}
      <div className={clsx('relative', label && ' mt-3.5')}>
        <ComboboxInput
          className={comboboxStyles({ hasErrors })}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={displayValue}
          autoCorrect="false"
          spellCheck={false}
          {...inputProps}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <PiCaretDownLight className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          className="dark:bg-gray-900 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredItems.map((item) => (
            <ComboboxOption
              key={item.item.id}
              value={item}
              className={({ focus }) =>
                clsx(
                  'relative cursor-default select-none py-2 pl-3 pr-9 dark:text-white',
                  focus ? 'bg-primary-600 text-white' : 'text-gray-900',
                )
              }
            >
              {({ focus, selected }) => (
                <>
                  <div className="flex items-center min-w-0">
                    <span className={clsx('flex-shrink-0 truncate', selected && 'font-semibold')}>{item.label}</span>
                    <span
                      className={clsx(
                        'ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300',
                        focus && 'text-primary-200',
                      )}
                    >{item.secondary}</span>
                  </div>

                  {selected && (
                    <span
                      className={clsx(
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                        focus ? 'text-white' : 'text-primary-600',
                      )}
                    >
                      <PiCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </ComboboxOption>
          ))}
          {allowNewValues && query && !filteredItems.some(item => item.label.toLowerCase() === query.toLowerCase()) && (
            <ComboboxOption
              value={query}
              className={({ focus }) =>
                clsx(
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  focus ? 'bg-primary-600 text-white' : 'text-gray-900',
                )
              }
            >
              {({ focus }) => (
                <div className="flex items-center">
                  <PiPlus className={clsx('h-5 w-5 mr-2', focus ? 'text-white' : 'text-gray-400')} />
                  <span>{addValueLabel} "{query}"</span>
                </div>
              )}
            </ComboboxOption>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}