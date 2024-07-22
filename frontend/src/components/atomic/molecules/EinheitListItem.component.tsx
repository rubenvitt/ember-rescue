import React, { useCallback, useMemo } from 'react';
import { useStatus } from '../../../hooks/status.hook.js';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { useModal } from '../../../hooks/modal.hook.js';
import { ItemType } from './Combobox.component.js';
import { EinheitDto, StatusDto } from '../../../types/types.js';
import { ModalConfig } from '../../../types/modalTypes.js';
import { DynamicGrid } from './DynamicGrid.component.js';
import { StatusButtonComponent } from '../atoms/StatusButton.component.js';
import { MinimalDotsDropdown } from './MinimalDropdown.component.js';
import { PiNumpad, PiStop, PiUsers } from 'react-icons/pi';
import { StatusLabel } from '../atoms/StatusLabel.component.js';

interface EinheitListItemProps {
  einheit: EinheitDto;
}

export const EinheitListItemComponent: React.FC<EinheitListItemProps> = ({ einheit }) => {
  const { status } = useStatus();
  const { changeStatus, removeEinheitFromEinsatz } = useEinheiten({ einheitId: einheit.id });
  const { openModal, closeModal } = useModal();

  const statusItems = useMemo<ItemType<StatusDto>[]>(() =>
      status.data?.map(item => ({
        label: String(item.code),
        secondary: item.bezeichnung,
        item,
      })) ?? [],
    [status]);

  const modalConfig = useMemo<ModalConfig>(() => ({
    variant: 'dialog',
    panelColor: 'primary',
    primaryAction: {
      label: 'test',
      onClick: () => {
      },
    },
    secondaryAction: {
      label: 'Abbrechen',
      onClick: () => {
      },
    },
    title: `Status ändern von ${einheit.funkrufname}`,
    content: (
      <div className="min-h-32">
        <DynamicGrid<StatusDto>
          items={statusItems}
          render={(item, className) => (
            <StatusButtonComponent onClick={onStatusButtonClick} item={item} className={className} />
          )}
        />
      </div>
    ),
  }), [einheit, statusItems]);

  const onStatusButtonClick = useCallback(async (item: { statusId: string }) => {
    await changeStatus.mutateAsync(item);
    return closeModal();
  }, [changeStatus, closeModal]);

  return (
    <li className={'overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700'}>
      <div
        className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 dark:bg-gray-800 dark:border-gray-400/5 p-6">
        <div className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
          {einheit.funkrufname} ({einheit.einheitTyp.label})
        </div>
        <div className="relative ml-auto">
          <MinimalDotsDropdown
            title="Optionen"
            dropdownItems={[
              {
                text: 'Besatzung',
                icon: PiUsers,
                onClick: () => {
                  // besatzung anzeigen oder so
                },
              },
              {
                text: 'Status wechseln',
                icon: PiNumpad,
                onClick: () => {
                  openModal(modalConfig);
                },
              },
              {
                text: 'Einsatz beenden',
                icon: PiStop,
                onClick: () => {
                  removeEinheitFromEinsatz.mutate({});
                },
              },
            ]}
          />
        </div>
      </div>

      <dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-700 px-6 py-4 text-sm leading-6">
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
    </li>
  );
};