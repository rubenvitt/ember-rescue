import { ChangeStatusDto, VehicleOnMissionDto, VehiclesDto } from '@bluelight-hub/shared/client/index.js';
import { Button, Card, Dropdown, List, Modal } from 'antd';
import React, { useCallback } from 'react';
import { PiCaretRight, PiNumpad, PiStop, PiUsers } from 'react-icons/pi';
import { useFahrzeuge } from '../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { useStatus } from '../../../hooks/status.hook.js';
import { StatusCode } from '../../../types/app/status.types.ts';
import { statusColors } from '../atoms/StatusLabel.component.tsx';
import { FahrzeugListItemComponent } from '../molecules/FahrzeugListItem.component.js';

interface FahrzeugelisteComponentProps {
  fahrzeuge?: VehiclesDto;
}

function FahrzeugExtra({ fahrzeug }: { fahrzeug: VehicleOnMissionDto }) {
  const { status } = useStatus();
  const { changeStatus, removeFahrzeugFromEinsatz } = useFahrzeuge({ fullOpta: fahrzeug.fullOpta });

  const onStatusButtonClick = useCallback(
    async (item: ChangeStatusDto) => {
      await changeStatus.mutateAsync(item);
      return Modal.destroyAll();
    },
    [changeStatus],
  );

  return (
    <Dropdown
      menu={{
        items: [
          {
            label: `Besatzung`,
            key: 'besatzung',
            icon: <PiUsers />,
            onClick: () => {
              // besatzung anzeigen oder so
            },
          },
          {
            label: 'Status wechseln',
            key: 'status',
            icon: <PiNumpad />,
            children: status.data?.data.map((status) => ({
              label: status.code + ' - ' + status.label,
              key: status.code,
              className: statusColors(status.code as StatusCode),
              icon: <PiNumpad />,
              onClick: () => onStatusButtonClick({ code: status.code, fahrzeugOpta: fahrzeug.fullOpta }),
            })) ?? [],
          },
          {
            label: 'Einsatz beenden',
            key: 'einsatz-ende',
            icon: <PiStop />,
            danger: true,
            onClick: () => {
              removeFahrzeugFromEinsatz.mutate({});
            },
          },
        ],
      }}
    >
      <Button type="text" shape="circle" title="Aktionen" icon={<PiCaretRight size={18} />} iconPosition="end" />
    </Dropdown>
  );
}

export const FahrzeugelisteComponent: React.FC<FahrzeugelisteComponentProps> = ({ fahrzeuge }) => (
  <List
    grid={{
      gutter: 16,
      xs: 1,
      sm: 1,
      md: 1,
      lg: 1,
      xl: 2,
      xxl: 3,
    }}
    loading={!fahrzeuge}
    dataSource={fahrzeuge?.fahrzeugeImEinsatz}
    renderItem={(fahrzeug) => {
      return (
        <List.Item>
          <Card type="inner" extra={<FahrzeugExtra fahrzeug={fahrzeug} />} title={`${fahrzeug.fullOpta} (${fahrzeug.optaFunktion})`}>
            <FahrzeugListItemComponent key={fahrzeug.fullOpta} fahrzeug={fahrzeug} />
          </Card>
        </List.Item>
      );
    }}
  />
);
