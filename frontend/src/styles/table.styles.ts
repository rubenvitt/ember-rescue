import { cva } from 'class-variance-authority';

export const cellStyles = cva('py-4 px-4 text-sm', {
  variants: {
    type: {
      header: 'font-semibold text-gray-900 bg-gray-50 bg-opacity-75 sticky top-0 z-10 border-b border-gray-300 backdrop-blur backdrop-filter',
      body: 'text-gray-500',
    },
    position: {
      first: 'sm:pl-6 lg:pl-8',
      last: 'sm:pr-6 lg:pr-8',
      middle: '',
    },
  },
  defaultVariants: {
    type: 'body',
    position: 'middle',
  },
});

export const rowStyles = cva('transition-colors hover:bg-gray-100', {
  variants: {
    striped: {
      even: 'bg-white',
      odd: 'bg-gray-50',
    },
  },
  defaultVariants: {
    striped: 'even',
  },
});