import React, { useCallback } from 'react';
import { EinheitListItemComponent } from '../molecules/EinheitListItem.component.js';
import { EinheitDto } from '../../../types/app/einheit.types.js';
import { Button, Card, Dropdown, List, Modal } from 'antd';
import { PiCaretRight, PiNumpad, PiStop, PiUsers } from 'react-icons/pi';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import { useStatus } from '../../../hooks/status.hook.js';
import { StatusDto } from '../../../types/app/status.types.js';
import { StatusButtonComponent } from '../atoms/StatusButton.component.js';
import { DynamicGrid } from '../molecules/DynamicGrid.component.js';

interface EinheitenlisteComponentProps {
  einheiten?: EinheitDto[];
}

function EinheitExtra({ einheit }: { einheit: EinheitDto }) {
  const { status } = useStatus();
  const { changeStatus, removeEinheitFromEinsatz } = useEinheiten({ einheitId: einheit.id });

  const onStatusButtonClick = useCallback(async (item: { statusId: string }) => {
    await changeStatus.mutateAsync(item);
    return Modal.destroyAll();
  }, [changeStatus]);

  return <Dropdown menu={{
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
        onClick: () => {
          Modal.confirm({
            type: 'confirm',
            icon: <PiNumpad className="text-primary-500" size={24} />,
            closable: true,
            maskClosable: true,
            title: `Status ändern von ${einheit.funkrufname}`,
            width: '70%',
            okButtonProps: {
              className: 'hidden',
            },
            cancelButtonProps: {
              className: 'hidden',
            },
            content: <div className="min-h-32">
              <DynamicGrid<StatusDto>
                items={status.data}
                render={(item, className) => (
                  <StatusButtonComponent onClick={onStatusButtonClick} item={item} className={className} />
                )}
              />
            </div>,
          });
        },
      },
      {
        label: 'Einsatz beenden',
        key: 'einsatz-ende',
        icon: <PiStop />,
        danger: true,
        onClick: () => {
          removeEinheitFromEinsatz.mutate({});
        },
      },
    ],
  }}>
    <Button type="text" shape="circle" title="Aktionen" icon={<PiCaretRight size={18} />}
            iconPosition="end" />
  </Dropdown>;
}

export const EinheitenlisteComponent: React.FC<EinheitenlisteComponentProps> = ({ einheiten }) => (
  <List grid={{
    gutter: 16,
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1,
    xl: 2,
    xxl: 3,
  }} loading={!einheiten} dataSource={einheiten}
        renderItem={(einheit) => {
          return <List.Item>
            <Card type="inner"
                  extra={<EinheitExtra einheit={einheit} />}
                  title={`${einheit.funkrufname} (${einheit.einheitTyp.label})`}
            >
              <EinheitListItemComponent key={einheit.id} einheit={einheit} />
            </Card>
          </List.Item>;
        }} />
);