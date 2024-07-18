// Updated Types
import { Button, ButtonColor } from '../../deprecated/button.js';
import React, { useCallback, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid/index.js';
import { FlexibleDialog } from './Dialog.js';
import { Identifiable } from '../../../types/types.ts';

export type ActionButton<T> = {
  label: string;
  onClick: (item: T) => void;
  color: ButtonColors;
  dialog?: {
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: (item: T) => void;
  };
};

type ExpandableListItemProps<T> = {
  item: T;
  renderContent: (item: T) => React.ReactNode;
  renderExpandedContent?: (item: T) => React.ReactNode;
  actionButtons?: ActionButton<T>[];
  isExpandable?: boolean;
};

type ExpandableListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  renderExpandedContent?: (item: T) => React.ReactNode;
  actionButtons?: ActionButton<T>[];
  isExpandable?: boolean;
};

const ExpandableListItem = <T, >({
                                   item,
                                   renderContent,
                                   renderExpandedContent,
                                   actionButtons = [],
                                   isExpandable = true,
                                 }: ExpandableListItemProps<T>) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  }, [isExpandable, isExpanded]);

  return (
    <li className="relative flex flex-col">
      <div
        onClick={toggleExpand}
        className="flex justify-between items-center px-4 py-5 hover:bg-gray-50 dark:hover:bg-gray-800 sm:px-6 cursor-pointer"
      >
        <div className="flex-grow">{renderContent(item)}</div>
        {isExpandable && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        )}
      </div>
      {isExpanded && isExpandable && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 sm:px-6">
          {renderExpandedContent && renderExpandedContent(item)}
          <div className="mt-3 flex justify-end space-x-3">
            {actionButtons.map((button, index) => (
              button.dialog ? (
                <FlexibleDialog
                  key={index}
                  variant="critical"
                  size="md"
                  actions={[
                    { label: button.dialog.cancelLabel },
                    {
                      onClick: () => button.dialog!.onConfirm(item),
                      label: button.dialog.confirmLabel,
                      variant: 'error',
                      primary: true,
                    },
                  ]}
                  message={button.dialog.message}
                  title={button.dialog.title}
                >
                  {({ open }) => (
                    <Button
                      onClick={open}
                      color={button.color}
                    >
                      {button.label}
                    </Button>
                  )}
                </FlexibleDialog>
              ) : (
                <Button
                  key={index}
                  onClick={() => button.onClick(item)}
                  color={button.color}
                >
                  {button.label}
                </Button>
              )
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

export const ExpandableList = <T extends Identifiable, >({
                                                           items,
                                                           renderItem,
                                                           renderExpandedContent,
                                                           actionButtons,
                                                           isExpandable = true,
                                                         }: ExpandableListProps<T>) => {
  return (
    <ul
      className="divide-y mt-8 divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-sm dark:shadow-gray-700 ring-1 ring-gray-900/5 sm:rounded-xl">
      {items.map((item) => (
        <ExpandableListItem
          key={item.id}
          item={item}
          renderContent={renderItem}
          renderExpandedContent={renderExpandedContent}
          actionButtons={actionButtons}
          isExpandable={isExpandable}
        />
      ))}
    </ul>
  );
};