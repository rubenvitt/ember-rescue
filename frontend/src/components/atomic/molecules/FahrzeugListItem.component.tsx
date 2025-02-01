import { VehicleOnMissionDto } from '@bluelight-hub/shared/client/index.js';
import dayjs from 'dayjs';
import React from 'react';
import { DescriptionListItem } from '../atoms/DescriptionListItem.component.tsx';
import { OptaTooltip } from '../atoms/OptaTooltip.component.tsx';
import { StatusLabel } from '../atoms/StatusLabel.component.tsx';

interface FahrzeugListItemProps {
  fahrzeug: VehicleOnMissionDto;
}

export const FahrzeugListItemComponent: React.FC<FahrzeugListItemProps> = ({ fahrzeug }) => {
  return (
    <>
      <dl className="-my-3 divide-y divide-gray-100 text-sm leading-6 dark:divide-gray-700">
        <DescriptionListItem label="Opta" value={<OptaTooltip fullOpta={fahrzeug.fullOpta} />} />
        <DescriptionListItem
          label="Platz für Einsatzkräfte"
          value={`${fahrzeug.kapazitaet} Personen möglich`}
        />
        <DescriptionListItem label="Einsatzbeginn" value={dayjs(fahrzeug.einsatzbeginn).format('DD.MM.YYYY HH:mm')} />
        <DescriptionListItem label="Personal" value={fahrzeug.personal.join(', ') || 'kein Personal eingeteilt'} />

        <div className="flex justify-between gap-x-4 py-3">
          <dd className="flex items-start gap-x-2">
            <StatusLabel status={fahrzeug.currentStatus} />
          </dd>
        </div>
      </dl>
    </>
  );
};
