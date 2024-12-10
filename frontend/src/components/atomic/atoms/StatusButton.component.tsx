import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { statusLabel } from './StatusLabel.component.js';
import { Button } from 'antd';
import { StatusDto } from '@bluelight-hub/shared/client/index.js';

interface StatusButtonProps {
  onClick: (props: { statusId: string }) => unknown;
  item: StatusDto;
  className: string;
}

export const StatusButtonComponent: React.FC<StatusButtonProps> = ({ onClick, item, className }) => {
  const onClickHandler = useCallback(() => onClick({ statusId: item.id }), [onClick, item.id]);

  return (
    <Button onClick={onClickHandler} type="text" className={twMerge('h-full w-full flex-col border border-gray-500', statusLabel({ status: item.code }), className)}>
      <p className="text-xl font-bold">{item.code}</p>
      <p className="text-wrap text-xs font-light">{item.label}</p>
    </Button>
  );
};
