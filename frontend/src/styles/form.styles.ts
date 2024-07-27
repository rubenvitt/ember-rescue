import { cva } from 'class-variance-authority';

export const formStyles = cva('', {
  variants: {
    layout: {
      simple: 'space-y-8',
      complex: 'space-y-10 divide-y divide-gray-900/10',
    },
  },
});

export const sectionStyles = cva('', {
  variants: {
    layout: {
      simple: '',
      complex: 'grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3',
    },
  },
});

export const fieldContainerStyles = cva('', {
  variants: {
    layout: {
      simple: '',
      complex: 'bg-gray-50 dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2',
    },
  },
});

export const fieldGridStyles = cva('grid grid-cols-12 gap-6', {
  variants: {
    layout: {
      simple: '',
      complex: 'px-4 py-6 sm:p-8',
    },
  },
});

export const buttonContainerStyles = cva('', {
  variants: {
    layout: {
      simple: 'flex justify-end space-x-3',
      complex: 'pt-6 flex items-center justify-end gap-x-6',
      none: '',
    },
  },
});