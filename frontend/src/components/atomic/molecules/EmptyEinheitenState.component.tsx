import { PlusIcon } from '@heroicons/react/20/solid';
import { useMemo } from 'react';
import { ComboInput } from './Combobox.component.js';
import { useEinheiten } from '../../../hooks/einheiten.hook.js';


export function EmptyEinheitenState() {
  const { einheiten, addEinheitToEinsatz } = useEinheiten();

  const einheitenComboItems = useMemo(() => {
    return einheiten.data?.map((einheit) => ({
      label: einheit.funkrufname,
      secondary: einheit.einheitTyp.label,
      item: einheit,
    }));
  }, [einheiten.data]);

  const empfohleneEinheiten = useMemo(() => {
    return einheiten.data?.sort((einheit) => {
      return einheit._count.einsatz_einheit;
    }).slice(0, 6)
      .map((einheit) => ({
        label: einheit.funkrufname,
        secondary: einheit.einheitTyp.label + ' (' + einheit.kapazitaet + ' Plätze)',
        item: einheit,
      }));
  }, [einheiten.data]);

  return (
    <div className="mx-auto max-w-md sm:max-w-3xl">
      <div>
        <div className="text-center">
          <PlusIcon
            className="mx-auto h-12 w-12 text-gray-400"
            aria-hidden="true"
          />
          <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">Neue Einheit disponieren</h2>
          <p className="mt-1 text-sm text-gray-500">Dem Einsatz wurden noch keine Fahrzeuge zugewiesen. Jetzt Fahrzeuge
            zuweisen.</p>
        </div>
        <form className="mt-6 sm:flex sm:items-center" action="#">
          <label htmlFor="einheit" className="sr-only">
            Email addresses
          </label>
          <div className="grid grid-cols-1 sm:flex-auto">
            <ComboInput items={einheitenComboItems ?? []} onChange={id => {
              console.log('Selected Einheit:', id);
            }} />

          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Disponieren
            </button>
          </div>
        </form>
      </div>
      <div className="mt-10">
        <h3 className="text-sm font-medium text-gray-500">Empfohlene Einheiten</h3>
        <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {empfohleneEinheiten?.map((einheit) => (
            <li key={einheit.item.id}>
              <button
                type="button"
                onClick={() => {
                  addEinheitToEinsatz.mutate({
                    einheitId: einheit.item.id,
                  });
                }}
                className="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="flex min-w-0 flex-1 items-center space-x-3">
                  <span className="block flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-green-500"></div>
                  </span>
                  <span className="block min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-900">{einheit.label}</span>
                    <span
                      className="block truncate text-sm font-medium text-gray-500">{einheit.secondary}</span>
                  </span>
                </span>
                <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
                  <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

}