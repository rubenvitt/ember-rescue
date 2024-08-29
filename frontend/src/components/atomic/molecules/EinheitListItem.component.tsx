import React from 'react';
import { StatusLabel } from '../atoms/StatusLabel.component.js';
import { EinheitDto } from '../../../types/app/einheit.types.js';

interface EinheitListItemProps {
  einheit: EinheitDto;
}

export const EinheitListItemComponent: React.FC<EinheitListItemProps> = ({ einheit }) => {
  return (
    <>
      <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-700 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Platz für Einsatzkräfte</dt>
          <dd className="text-gray-700 dark:text-gray-300">
            {einheit.kapazitaet} Personen möglich
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Temporäre Einheit</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900 dark:text-gray-300">
              {einheit.istTemporaer ? 'temp' : 'dauerhaft'}
            </div>
            <StatusLabel status={einheit.status} />
          </dd>
        </div>
      </dl>
    </>
  );
};