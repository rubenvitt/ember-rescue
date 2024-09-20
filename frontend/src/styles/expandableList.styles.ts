import { cva } from 'class-variance-authority';

export const listStyles = cva(
  'divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-sm dark:shadow-gray-950 ring-1 ring-gray-900/5 sm:rounded-xl',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const listItemStyles = cva('relative flex flex-col', {
  variants: {
    isExpanded: {
      true: '',
      false: '',
    },
  },
});

export const contentStyles = cva(
  'flex justify-between items-center px-4 py-5 hover:bg-gray-50 dark:hover:bg-gray-950/30 sm:px-6 cursor-pointer',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const expandedContentStyles = cva('px-4 py-3 bg-gray-50 dark:bg-gray-800 sm:px-6', {
  variants: {},
  defaultVariants: {},
});
