import React from 'react';
import { StatusLabel } from '../atoms/StatusLabel.component.js';
import { FahrzeugDto } from '../../../types/app/fahrzeug.types.js';

interface FahrzeugListItemProps {
  fahrzeug: FahrzeugDto;
}

export const FahrzeugListItemComponent: React.FC<FahrzeugListItemProps> = ({ fahrzeug }) => {
  return (
    <>
      <dl className="-my-3 divide-y divide-gray-100 text-sm leading-6 dark:divide-gray-700">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Platz für Einsatzkräfte</dt>
          <dd className="text-gray-700 dark:text-gray-300">{fahrzeug.kapazitaet} Personen möglich</dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Temporäres Fahrzeug</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900 dark:text-gray-300">
              {fahrzeug.istTemporaer ? 'temp' : 'dauerhaft'}
            </div>
            <StatusLabel status={fahrzeug.status} />
          </dd>
        </div>
      </dl>
    </>
  );
};
