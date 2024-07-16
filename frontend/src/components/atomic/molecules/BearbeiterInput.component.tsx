import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import React, { useMemo, useState } from 'react';
import { IdentifiableLabel } from '../../../types/types.js';
import { clsx } from 'clsx';
import { ValidationError } from '@tanstack/react-form';

type Props<T extends IdentifiableLabel> = {
  items: T[];
  allowCustom?: boolean;
  errors?: ValidationError[];
  inputProps?: Pick<React.ComponentPropsWithoutRef<'input'>, 'name' | 'onBlur' | 'required' | 'placeholder'> & {
    onChange: (value: T | null) => void
  };
  labelText: string;
}

// FIXME: this one is working better as my ComboInput in some cases (like adding new things). I should merge them and delete this.
export function BearbeiterInput<T extends IdentifiableLabel>({
                                                               items,
                                                               allowCustom = true,
                                                               inputProps,
                                                               errors,
                                                               labelText,
                                                             }: Props<T>) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<T | null>();

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase());
      });

  const cleanedErrors = useMemo(() => {
    return errors?.filter((err: ValidationError) => Boolean(err));
  }, [errors]);

  const hasErrors = useMemo(() => (cleanedErrors?.length ?? 0) > 0, [cleanedErrors]);


  return (
    <Combobox
      as="div"
      name={inputProps?.name}
      value={selectedItem}
      aria-placeholder={inputProps?.placeholder}
      aria-required={inputProps?.required}
      onChange={(item) => {
        setQuery('');
        setSelectedItem(item);
        inputProps?.onChange?.(item);
      }}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">{labelText}</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className={clsx(
            'w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 shadow-sm ring-inset dark:bg-gray-900 dark:text-white ring-1 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            hasErrors ? 'ring-red-500 focus:ring-red-500 placeholder:text-red-300 text-red-900' : 'text-gray-900 dark:text-white ring-gray-300 focus:ring-indigo-600',
          )}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={(item: T) => item?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className={clsx('h-5 w-5', hasErrors ? 'text-red-500' : 'text-gray-400')}
                             aria-hidden="true" />
        </ComboboxButton>

        {((filteredItems.length > 0) || (allowCustom && query.length > 0)) && (
          <ComboboxOptions
            className="absolute z-10 mt-1 max-h-60 w-full dark:bg-gray-900 dark:text-white overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 focus:outline-none sm:text-sm">
            {allowCustom && query.length > 0 && !filteredItems.find(value => value.name === query) && (
              <ComboboxOption
                value={{ id: null, name: query }}
                className={({ focus }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    focus ? 'bg-primary-600 text-white' : 'text-gray-900',
                  )
                }
              >
                {({ focus, selected }) => (
                  <>
                    Neuer Bearbeiter: <span
                    className={clsx('truncate', selected && 'font-semibold')}>{query}</span>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          focus ? 'text-white' : 'text-primary-600',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
            )}
            {filteredItems.map((item) => (
              <ComboboxOption
                key={item.id}
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
                    <span className={clsx('block truncate', selected && 'font-semibold')}>{item.name}</span>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          focus ? 'text-white' : 'text-primary-600',
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
      {hasErrors && cleanedErrors?.map(error => (
        <p key={String(error)} className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      ))}
    </Combobox>
  );
}
