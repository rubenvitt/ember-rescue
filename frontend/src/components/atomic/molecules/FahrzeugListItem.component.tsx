import React from 'react';
import { VehicleOnMissionDto } from '@bluelight-hub/shared/client/index.js';

interface FahrzeugListItemProps {
  fahrzeug: VehicleOnMissionDto;
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
          <dd className="flex items-start gap-x-2">{/*<StatusLabel status={} /> /!* FIXME[ember-rescue-68](rubeen, 30.11.24): ADD STATUS *!/*/}</dd>
        </div>
      </dl>
    </>
  );
};
