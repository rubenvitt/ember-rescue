import { ReactNode } from 'react';
import { ButtonColor } from '../styles/button.styles.js';
import { Identifiable } from './types.js';

export type ActionButton<T> = {
  label: string;
  color: ButtonColor;
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