import { cva } from 'class-variance-authority';

export const navItemStyles = cva('group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6', {
  variants: {
    current: {
      true: 'bg-primary-200 text-gray-900 dark:bg-primary-900 dark:text-gray-200',
      false: 'text-white hover:bg-primary-500 dark:hover:bg-primary-800',
    },
  },
  defaultVariants: {
    current: false,
  },
});
