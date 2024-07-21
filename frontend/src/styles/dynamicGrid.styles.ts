import { cva } from 'class-variance-authority';

export const gridItemStyles = cva('p-4 flex items-center justify-center', {
  variants: {
    span: {
      full: 'col-span-3',
      two: 'col-start-2 col-span-2',
      default: '',
    },
  },
  defaultVariants: {
    span: 'default',
  },
});