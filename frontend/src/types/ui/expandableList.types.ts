import { VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';
import { buttonVariants } from '../../styles/button.styles.js';

export type ActionButton = VariantProps<typeof buttonVariants> & {
  label: string;
  danger?: boolean;
  disabled?: boolean;
} & (
    | {
    onClick: () => void;
        dialog?: never;
      }
    | {
        dialog: {
          title: string;
          message: string;
          confirmLabel: string;
          cancelLabel: string;
        onConfirm: () => void;
        };
        onClick?: never;
      }
  );

export type ExpandableListItemProps<T> = {
  item: T;
  renderContent: (item: T) => ReactNode;
  renderExpandedContent?: (item: T) => ReactNode;
  actionButtons?: (item: T) => ActionButton[];
  isExpandable?: boolean;
};
