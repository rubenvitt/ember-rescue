import React from 'react';
import { cva } from 'class-variance-authority';
import { SmallStatusDto, StatusCode } from '../../../types/app/status.types.js';

export const statusLabel = cva<{ status: { [key in StatusCode]: string } }>(
  'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      status: {
        1: 'bg-green-200/30 text-green-900 ring-green-500 dark:bg-green-800/30 dark:text-green-100 hover:bg-green-500/30',
        2: 'bg-blue-200/30 text-blue-900 ring-blue-500 dark:bg-blue-800/30 dark:text-blue-100 hover:bg-blue-500/30',
        3: 'bg-yellow-200/30 text-yellow-900 ring-yellow-500 dark:bg-yellow-800/30 dark:text-yellow-100 hover:bg-yellow-500/30',
        4: 'bg-orange-200/30 text-orange-900 ring-orange-500 dark:bg-orange-800/30 dark:text-orange-100 hover:bg-orange-500/30',
        5: 'bg-purple-200/30 text-purple-900 ring-purple-500 dark:bg-purple-800/30 dark:text-purple-100 hover:bg-purple-500/30',
        6: 'bg-gray-200/30 text-gray-900 ring-gray-500 dark:bg-gray-800/30 dark:text-gray-100 hover:bg-gray-500/30',
        7: 'bg-indigo-200/30 text-indigo-900 ring-indigo-500 dark:bg-indigo-800/30 dark:text-indigo-100 hover:bg-indigo-500/30',
        8: 'bg-teal-200/30 text-teal-900 ring-teal-500 dark:bg-teal-800/30 dark:text-teal-100 hover:bg-teal-500/30',
        9: 'bg-pink-200/30 text-pink-900 ring-pink-500 dark:bg-pink-800/30 dark:text-pink-100 hover:bg-pink-500/30',
        0: 'bg-rose-200/30 text-rose-900 ring-rose-500 dark:bg-rose-800/30 dark:text-rose-100 hover:bg-rose-500/30',
        none: '',
      },
    },
    defaultVariants: {
      status: 3,
    },
  },
);

export const statusRgbColors: Record<string, string> = {
  '1': '#4ade80',
  '2': '#3b82f6',
  '3': '#eab308',
  '4': '#fb923c',
  '5': '#a855f7',
  '6': '#9ca3af',
  '7': '#6366f1',
  '8': '#14b8a6',
  '9': '#ec4899',
  '0': '#f43f5e',
};

interface StatusLabelProps {
  status: SmallStatusDto;
}

export const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  return (
    <div className={statusLabel({ status: status.code as SmallStatusDto['code'] })}>
      {status.code} ({status.bezeichnung})
    </div>
  );
};