import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonColor } from './button.styles.js';

type ColorVariants = {
  [color in ButtonColor]: string;
};

const colorVariants: ColorVariants = {
  primary: 'bg-primary-700 text-white',
  dark: 'bg-gray-800 text-white',
  'dark/white': 'bg-white text-gray-800',
  amber: 'bg-amber-700 text-white',
  blue: 'bg-blue-700 text-white',
  cyan: 'bg-cyan-700 text-white',
  emerald: 'bg-emerald-700 text-white',
  fuchsia: 'bg-fuchsia-700 text-white',
  green: 'bg-green-700 text-white',
  indigo: 'bg-indigo-700 text-white',
  light: 'bg-gray-200 text-gray-800',
  lime: 'bg-lime-700 text-white',
  orange: 'bg-orange-700 text-white',
  pink: 'bg-pink-700 text-white',
  red: 'bg-red-700 text-white',
  purple: 'bg-purple-700 text-white',
  rose: 'bg-rose-700 text-white',
  sky: 'bg-sky-700 text-white',
  teal: 'bg-teal-700 text-white',
  violet: 'bg-violet-700 text-white',
  white: 'bg-white text-gray-800',
  yellow: 'bg-yellow-700 text-white',
  zinc: 'bg-zinc-700 text-white',
  'dark/zinc': 'bg-zinc-800 text-white',
};

export const modalPanel = cva('pointer-events-auto transform transition-all', {
  variants: {
    variant: {
      dialog: 'relative rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg overflow-hidden',
      panel: 'w-screen shadow-xl my-4 rounded-l-lg overflow-y-scroll',
    },
    fullWidth: {
      true: 'w-full md:ml-24',
      false: 'max-w-md',
    },
  },
  defaultVariants: {
    variant: 'dialog',
    fullWidth: false,
  },
});

export type ModalPanelProps = VariantProps<typeof modalPanel>;

export const modalHeader = cva('px-4 py-5 sm:p-6', {
  variants: {
    panelColor: colorVariants,
  },
  defaultVariants: {
    panelColor: 'primary',
  },
});

export type ModalHeaderProps = VariantProps<typeof modalHeader>;

export const modalBody = cva('px-4 py-5 sm:p-6 bg-white', {
  variants: {
    variant: {
      dialog: '',
      panel: 'flex-1 overflow-y-auto',
    },
  },
  defaultVariants: {
    variant: 'dialog',
  },
});

export type ModalBodyProps = VariantProps<typeof modalBody>;

// @ts-ignore
const hoverColorVariants: ColorVariants = Object.fromEntries(
  Object.entries(colorVariants).map(([key, value]) => [
    key,
    value
      .replace('text-white', 'text-white/80 hover:text-white')
      .replace('text-gray-800', 'text-gray-800/80 hover:text-gray-800'),
  ]),
);

export const modalCloseButton = cva('rounded-md focus:outline-none focus:ring-2 focus:ring-white/20', {
  variants: {
    panelColor: hoverColorVariants,
  },
});

export type ModalCloseButtonProps = VariantProps<typeof modalCloseButton>;

export const modalActionButton = cva(
  'inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  {
    variants: {
      intent: {
        primary: 'text-white hover:bg-primary-500 focus-visible:outline-primary-600',
        secondary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
      },
      color: colorVariants,
    },
    compoundVariants: [
      // Primary intent variants
      // Special cases for 'white' and 'light' colors
      {
        intent: 'primary',
        color: 'white',
        class: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-400',
      },
      {
        intent: 'primary',
        color: 'light',
        class: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:outline-gray-400',
      },
      {
        intent: 'secondary',
        color: 'white',
        class: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
      },
      {
        intent: 'secondary',
        color: 'light',
        class: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
      },
      {
        intent: 'primary',
        color: 'green',
        class: 'bg-green-100 text-green-500 hover:bg-green-100',
      },
    ],
    defaultVariants: {
      intent: 'primary',
      color: 'primary',
    },
  },
);

export type ModalActionButtonProps = VariantProps<typeof modalActionButton>;
