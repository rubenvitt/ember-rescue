import { cva } from 'class-variance-authority';

export const gridItemStyles = cva('p-4 flex items-center justify-center', {
  variants: {
    span: {
      full: 'md:col-span-3',
      two: 'md:col-start-2 md:col-span-2',
      default: '',
    },
  },
  defaultVariants: {
    span: 'default',
  },
});