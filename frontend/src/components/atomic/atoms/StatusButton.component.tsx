import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { statusLabel } from './StatusLabel.component.js';

import { StatusDto } from '../../../types/app/status.types.js';

interface StatusButtonProps {
  onClick: (props: { statusId: string }) => unknown;
  item: StatusDto;
  className: string;
}

export const StatusButtonComponent: React.FC<StatusButtonProps> = ({ onClick, item, className }) => {
  const onClickHandler = useCallback(() => onClick({ statusId: item.id }), [onClick, item.id]);

  return (
    <button
      onClick={onClickHandler}
      className={twMerge('w-full h-full flex-col border border-gray-500', statusLabel({ status: item.code }), className)}
    >
      <p className="font-bold text-xl">{item.code}</p>
      <p className="font-light text-xs">{item.bezeichnung}</p>
    </button>
  );
};