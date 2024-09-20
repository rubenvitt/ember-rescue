import { cva } from 'class-variance-authority';

export const cellStyles = cva('py-4 px-4 text-sm', {
  variants: {
    type: {
      header:
        'font-semibold text-gray-900 bg-gray-50 bg-opacity-75 sticky top-0 z-10 border-b border-gray-300 backdrop-blur backdrop-filter dark:bg-gray-950 dark:text-white',
      body: 'text-gray-500 dark:text-white',
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

export const rowStyles = cva('transition-colors hover:bg-gray-100 dark:hover:bg-gray-950/50', {
  variants: {
    striped: {
      even: 'bg-white dark:bg-gray-800/50',
      odd: 'bg-gray-50 dark:bg-gray-800',
    },
  },
  defaultVariants: {
    striped: 'even',
  },
});
