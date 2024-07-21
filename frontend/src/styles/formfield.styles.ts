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
      hasErrors: {
        true: 'ring-red-500 focus:ring-red-500 placeholder:text-red-300 text-red-900',
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
      hasErrors: false,
    },
  },
);