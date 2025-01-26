import { VehicleOnMissionDto } from '@bluelight-hub/shared/client/index.js';
import { useForm } from '@tanstack/react-form';
import { Form, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import React, { useCallback, useMemo } from 'react';
import { PiAmbulance, PiEmpty, PiPlus, PiShieldPlus } from 'react-icons/pi';
import { twMerge } from 'tailwind-merge';
import { useFahrzeuge } from '../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { useRecommendedFahrzeuge } from '../../../hooks/fahrzeuge/recommended-fahrzeuge.hook.js';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';

const RecommendedFahrzeug: React.FC<{ fahrzeug: { item: VehicleOnMissionDto; label: string; secondary: string }; onAdd: (fullOpta: string) => void }> = ({ fahrzeug, onAdd }) => (
  <li>
    <button
      type="button"
      onClick={() => onAdd(fahrzeug.item.fullOpta)}
      className="group cursor-pointer flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-xs hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:bg-gray-800"
    >
      <span className="flex min-w-0 flex-1 items-center space-x-3">
        <span className="block shrink-0">
          <div className="h-10 w-10 rounded-full bg-green-500 dark:bg-green-800"></div>
        </span>
        <span className="block min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{fahrzeug.label}</span>
          <span className="block truncate text-sm font-medium text-gray-600 dark:text-gray-400">{fahrzeug.secondary}</span>
        </span>
      </span>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center">
        <PiPlus className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-600" aria-hidden="true" />
      </span>
    </button>
  </li>
);

interface Props {
  classNameContainer?: string;
}

export function AddFahrzeuge({ classNameContainer }: Props) {
  const empfohleneFahrzeuge = useRecommendedFahrzeuge({ maxResults: 6 });
  const { addFahrzeugToEinsatz, fahrzeuge } = useFahrzeuge();
  const form = useForm<{ fahrzeug: string }>({
    onSubmit({ value }) {
      handleAddFahrzeug(value.fahrzeug);
      form.reset();
    },
  });

  const fahrzeugeNichtImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return (fahrzeuge.data?.data.verfuegbareFahrzeuge ?? []).map((fahrzeug) => ({
      value: fahrzeug.fullOpta,
      searchString: fahrzeug.fullOpta.toLowerCase() + fahrzeug.optaFunktion?.toLowerCase?.(),
      label: (
        <div className="flex justify-between gap-4">
          <span className="shrink-0 truncate">{fahrzeug.fullOpta}</span>
          <span className="ml-2 shrink truncate text-gray-500 dark:text-gray-300">{fahrzeug.optaFunktion}</span>
        </div>
      ),
      item: fahrzeug,
    }));
  }, [fahrzeuge.data]);

  const handleAddFahrzeug = useCallback(
    async (fullOpta: string) => {
      console.log('addFahrzeugToEinsatz', { fullOpta });
      await addFahrzeugToEinsatz.mutateAsync({ fullOpta });
    },
    [addFahrzeugToEinsatz],
  );

  return (
    <div className={twMerge('mx-auto max-w-md rounded-lg border border-primary-500 p-6 sm:max-w-3xl', classNameContainer)}>
      <div className="mb-6 text-center">
        {empfohleneFahrzeuge.length == 0 ? <PiEmpty className="mx-auto h-12 w-12 text-red-500" aria-hidden="true" /> : <PiShieldPlus className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />}
        <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900 dark:text-white">Neue Fahrzeug disponieren</h2>
        {fahrzeuge.data?.data.fahrzeugeImEinsatz.length === 0 && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Dem Einsatz wurden noch keine Fahrzeuge zugewiesen. Jetzt Fahrzeuge zuweisen.</p>
        )}
      </div>

      <FormLayout<{ fullOpta: string }>
        type="oneLine"
        form={{
          initialValues: { fullOpta: '' },
          async onFinish(data) {
            console.log('onFinish', { data });
            await handleAddFahrzeug(data.fullOpta);
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
        <Form.Item name="fullOpta" className="w-full m-0 p-0">
          <Select
            placeholder="Fahrzeug dem Einsatz hinzufügen"
            className="w-full"
            showSearch
            allowClear
            // @ts-ignore
            spellCheck={false}
            filterOption={(inputValue, option) => {
              // Create a regular expression that matches the characters of inputValue in sequence, ignoring spaces.
              const regex = new RegExp(inputValue.split('').join('.*'), 'i');
              return regex.test(option?.searchString);
            }}
            onChange={(value) => {
              console.log('onChange', { value });
            }}
            options={fahrzeugeNichtImEinsatzItems}
            loading={fahrzeuge.isLoading}
          />
        </Form.Item>
      </FormLayout>
      <div className="mt-10">
        <h3 className="text-sm font-medium text-gray-500">Empfohlene Fahrzeuge</h3>
        {empfohleneFahrzeuge.length > 0 ? (
          <>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {empfohleneFahrzeuge?.map((fahrzeug) => {
                return (
                  <>
                    <RecommendedFahrzeug key={fahrzeug.item.fullOpta} fahrzeug={fahrzeug} onAdd={handleAddFahrzeug} />
                  </>
                );
              })}
            </ul>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keine weiteren empfohlenen Fahrzeuge verfügbar.</p>
          </>
        )}
      </div>
    </div>
  );
}
