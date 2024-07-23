import { ReactNode } from 'react';
import { buttonVariants } from '../styles/button.styles.js';
import { Identifiable } from './types.js';
import { VariantProps } from 'class-variance-authority';

export type ActionButton<T> = VariantProps<typeof buttonVariants> & {
  label: string;
} & (
  | {
  onClick: (item: T) => void;
  dialog?: never;
}
  | {
  dialog: {
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: (item: T) => void;
  };
  onClick?: never;
}
  );

export type ExpandableListItemProps<T> = {
  item: T;
  renderContent: (item: T) => ReactNode;
  renderExpandedContent?: (item: T) => ReactNode;
  actionButtons?: ActionButton<T>[];
  isExpandable?: boolean;
};

export type ExpandableListProps<T extends Identifiable> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  renderExpandedContent?: (item: T) => ReactNode;
  actionButtons?: ActionButton<T>[];
  isExpandable?: boolean;
};