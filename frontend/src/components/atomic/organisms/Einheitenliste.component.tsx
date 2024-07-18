import { EinheitDto, StatusDto } from '../../../types/types.js';
import { PiNumpad, PiStop, PiUsers } from 'react-icons/pi';
import { useCallback, useMemo } from 'react';
import { ItemType } from '../molecules/Combobox.component.js';
import { useStatus } from '../../../hooks/status.hook.js';
import { useEinheiten } from '../../../hooks/einheiten.hook.js';
import clsx from 'clsx';
import { StatusLabel, statusLabel } from '../atoms/StatusLabel.component.js';
import { MinimalDotsDropdown } from '../molecules/MinimalDropdown.component.js';
import { useModal } from '../../../hooks/modal.hook.js';
import { ModalConfig } from '../../../types/modalTypes.js';
import { DynamicGrid } from '../molecules/DynamicGrid.component.js';


type Props = {
  einheiten: EinheitDto[],
}

interface EinheitListItemProps {
  einheit: EinheitDto;
}

interface StatusButtonProps {
  onClick: (props: { statusId: string }) => unknown,
  item: StatusDto,
  className: string
}

function StatusButton({ onClick, item, className }: StatusButtonProps) {

  const onClickHandler = useCallback(() => onClick({ statusId: item.id }), [onClick, item.id]);
  return <button
    onClick={onClickHandler}
    className={clsx(className, 'w-full h-full flex-col border border-gray-500', statusLabel({ status: item.code }))}>
    <p className="font-bold text-xl">{item.code}</p>
    <p className="font-light text-xs">{item.bezeichnung}</p>
  </button>;
}

function EinheitListItem({ einheit }: EinheitListItemProps) {
  const { status } = useStatus();
  const { changeStatus, removeEinheitFromEinsatz } = useEinheiten({ einheitId: einheit.id });

  const statusItems = useMemo<ItemType<StatusDto>[]>(() => {
    return status.data?.map(item => ({
      label: item.code,
      secondary: item.bezeichnung,
      item,
    })) ?? [];
  }, [status]);

  const { openModal, closeModal } = useModal();
  const modalConfig = useMemo<ModalConfig>(() => {
    return {
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
      content: (<div className="min-h-32">
        <DynamicGrid<StatusDto> items={statusItems}
                                render={(item, className) => (
                                  <StatusButton onClick={onStatusButtonClick} item={item}
                                                className={className} />
                                )}
        />
      </div>),
    };
  }, [einheit, statusItems]);

  const onStatusButtonClick = useCallback(async (item: { statusId: string }) => {
    await changeStatus.mutateAsync(item);
    return closeModal();
  }, [changeStatus.mutateAsync]);

  return <li className="overflow-hidden rounded-xl border border-gray-200">
    <div
      className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 dark:bg-gray-800 dark:border-gray-400/5 p-6">
      {/*<img*/}
      {/*  src={client.imageUrl}*/}
      {/*  alt={client.name}*/}
      {/*  className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"*/}
      {/*/>*/}
      <div
        className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{einheit.funkrufname} ({einheit.einheitTyp.label})
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
          ]} />
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
          <div
            className="font-medium text-gray-900 dark:text-gray-300">{einheit.istTemporaer ? 'temp' : 'dauerhaft'}</div>
          <StatusLabel status={einheit.status} />
        </dd>
      </div>
    </dl>
  </li>;
}

export function EinheitenlisteComponent({ einheiten }: Props) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {einheiten.map((einheit) => <EinheitListItem key={einheit.id} einheit={einheit} />)}
    </ul>
  );
}
