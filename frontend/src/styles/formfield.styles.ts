import { cva } from 'class-variance-authority';

export const inputStyles = cva(
  'block w-full rounded-md shadow-sm sm:text-sm',
  {
    variants: {
      layout: {
        complex: 'border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:leading-6',
        simple: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
      },
      readonly: {
        true: 'bg-gray-100 cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      {
        layout: 'complex',
        readonly: true,
        class: 'bg-gray-100',
      },
    ],
    defaultVariants: {
      layout: 'simple',
      readonly: false,
    },
  },
);