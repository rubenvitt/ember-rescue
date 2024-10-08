import { useRecommendedEinheiten } from '../../../hooks/einheiten/recommended-einheiten.hook.js';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { PiAmbulance, PiEmpty, PiPlus, PiShieldPlus } from 'react-icons/pi';
import React, { useCallback, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { twMerge } from 'tailwind-merge';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';
import { Select } from 'formik-antd';
import { DefaultOptionType } from 'antd/lib/select/index.js';

const RecommendedEinheit: React.FC<{ einheit: any; onAdd: (id: string) => void }> = ({ einheit, onAdd }) => (
  <li>
    <button
      type="button"
      onClick={() => onAdd(einheit.item.id)}
      className="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:bg-gray-800"
    >
      <span className="flex min-w-0 flex-1 items-center space-x-3">
        <span className="block flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-green-500 dark:bg-green-800"></div>
        </span>
        <span className="block min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{einheit.label}</span>
          <span className="block truncate text-sm font-medium text-gray-600 dark:text-gray-400">
            {einheit.secondary}
          </span>
        </span>
      </span>
      <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
        <PiPlus className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-600" aria-hidden="true" />
      </span>
    </button>
  </li>
);

interface Props {
  classNameContainer?: string;
}

export function AddEinheiten({ classNameContainer }: Props) {
  const empfohleneEinheiten = useRecommendedEinheiten({ maxResults: 6 });
  const { addEinheitToEinsatz, einheitenNichtImEinsatz, einheitenImEinsatz, einheiten } = useEinheiten();
  const form = useForm<{ einheit: string }>({
    onSubmit({ value }) {
      handleAddEinheit(value.einheit);
      form.reset();
    },
  });

  const einheitenNichtImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return einheitenNichtImEinsatz?.map((einheit) => ({
      value: einheit.id,
      searchString: einheit.funkrufname.toLowerCase() + einheit.einheitTyp.label.toLowerCase(),
      label: (
        <div className="flex justify-between gap-4">
          <span className="flex-shrink-0 truncate">{einheit.funkrufname}</span>
          <span className="ml-2 flex-shrink truncate text-gray-500 dark:text-gray-300">{einheit.einheitTyp.label}</span>
        </div>
      ),
      item: einheit,
    }));
  }, [einheitenNichtImEinsatz]);

  const handleAddEinheit = useCallback(
    async (einheitId: string) => {
      await addEinheitToEinsatz.mutateAsync({ einheitId });
    },
    [addEinheitToEinsatz],
  );

  return (
    <div
      className={twMerge('mx-auto max-w-md rounded-lg border border-primary-500 p-6 sm:max-w-3xl', classNameContainer)}
    >
      <div className="mb-6 text-center">
        {empfohleneEinheiten.length == 0 ? (
          <PiEmpty className="mx-auto h-12 w-12 text-red-500" aria-hidden="true" />
        ) : (
          <PiShieldPlus className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        )}
        <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Neue Einheit disponieren
        </h2>
        {einheitenImEinsatz.data?.length === 0 && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Dem Einsatz wurden noch keine Fahrzeuge zugewiesen. Jetzt Fahrzeuge zuweisen.
          </p>
        )}
      </div>

      <FormLayout<{ einheitId: string }>
        type="oneLine"
        formik={{
          initialValues: { einheitId: '' },
          async onSubmit(data) {
            await handleAddEinheit(data.einheitId);
          },
        }}
        buttons={{
          submit: {
            type: 'primary',
            htmlType: 'submit',
            icon: <PiAmbulance />,
            iconPosition: 'end',
            children: 'Disponieren',
          },
        }}
        resetOnSubmit={true}
      >
        <Select
          name="einheitId"
          placeholder="Einheit dem Einsatz hinzufügen"
          className="w-full"
          showSearch
          // @ts-ignore
          spellCheck={false}
          filterOption={(inputValue, option) => {
            // Create a regular expression that matches the characters of inputValue in sequence, ignoring spaces.
            const regex = new RegExp(inputValue.split('').join('.*'), 'i');
            return regex.test(option?.searchString);
          }}
          options={einheitenNichtImEinsatzItems}
          loading={einheiten.isLoading}
        />
      </FormLayout>
      <div className="mt-10">
        <h3 className="text-sm font-medium text-gray-500">Empfohlene Einheiten</h3>
        {empfohleneEinheiten.length > 0 ? (
          <>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {empfohleneEinheiten?.map((einheit) => (
                <RecommendedEinheit key={einheit.item.id} einheit={einheit} onAdd={handleAddEinheit} />
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keine weiteren empfohlenen Einheiten verfügbar.</p>
          </>
        )}
      </div>
    </div>
  );
}
