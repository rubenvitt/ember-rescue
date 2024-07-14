import React from 'react';
import { Button } from '../../catalyst-components/button.js';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const colorStyles = {
  'dark/zinc': { bg: 'bg-zinc-900', text: 'text-white' },
  light: { bg: 'bg-white', text: 'text-zinc-950' },
  'dark/white': { bg: 'bg-zinc-900 dark:bg-white', text: 'text-white dark:text-zinc-950' },
  dark: { bg: 'bg-zinc-900', text: 'text-white' },
  white: { bg: 'bg-white', text: 'text-zinc-950' },
  zinc: { bg: 'bg-zinc-600', text: 'text-white' },
  indigo: { bg: 'bg-indigo-500', text: 'text-white' },
  cyan: { bg: 'bg-cyan-300', text: 'text-cyan-950' },
  red: { bg: 'bg-red-600', text: 'text-white' },
  orange: { bg: 'bg-orange-500', text: 'text-white' },
  amber: { bg: 'bg-amber-400', text: 'text-amber-950' },
  yellow: { bg: 'bg-yellow-300', text: 'text-yellow-950' },
  lime: { bg: 'bg-lime-300', text: 'text-lime-950' },
  green: { bg: 'bg-green-600', text: 'text-white' },
  emerald: { bg: 'bg-emerald-600', text: 'text-white' },
  teal: { bg: 'bg-teal-600', text: 'text-white' },
  sky: { bg: 'bg-sky-500', text: 'text-white' },
  blue: { bg: 'bg-blue-600', text: 'text-white' },
  violet: { bg: 'bg-violet-500', text: 'text-white' },
  purple: { bg: 'bg-purple-500', text: 'text-white' },
  fuchsia: { bg: 'bg-fuchsia-500', text: 'text-white' },
  pink: { bg: 'bg-pink-500', text: 'text-white' },
  rose: { bg: 'bg-rose-500', text: 'text-white' },
};

export type PanelColors = keyof typeof colorStyles;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  primaryAction: {
    label: string;
    onClick: () => void;
    color?: React.ComponentProps<typeof Button>['color'];
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    color?: React.ComponentProps<typeof Button>['color'];
  };
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  fullWidth?: boolean;
  variant?: 'dialog' | 'panel';
  panelColor?: PanelColors;
}

export const ModalComponent: React.FC<ModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       title,
                                                       content,
                                                       primaryAction,
                                                       secondaryAction,
                                                       Icon,
                                                       fullWidth,
                                                       variant = 'dialog',
                                                       panelColor = 'indigo',
                                                     }) => {
  const isPanel = variant === 'panel';
  const { bg, text } = colorStyles[panelColor];

  const commonPanelClasses = 'pointer-events-auto transform transition';
  const dialogPanelClasses = clsx(
    fullWidth ? 'w-full' : 'sm:max-w-lg',
    'relative overflow-hidden rounded-lg bg-white text-left shadow-xl',
    'data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in',
    'sm:my-8 sm:w-full data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95',
  );
  const sidePanelClasses = 'w-screen max-w-md h-full flex flex-col shadow-xl data-[closed]:translate-x-full duration-500 ease-in-out sm:duration-700';

  return (
    <Dialog className="relative z-50" open={isOpen} onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className={clsx(
        'fixed inset-0 z-10 overflow-y-auto',
        isPanel ? 'overflow-hidden' : 'mt-16',
      )}>
        <div className={clsx(
          isPanel ? 'absolute inset-0 overflow-hidden' : 'flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:py-0 lg:ml-72 px-6',
        )}>
          {isPanel && (
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel transition className={clsx(commonPanelClasses, sidePanelClasses, bg)}>
                <div className={clsx('px-4 py-6 sm:px-6', text)}>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-base font-semibold leading-6">{title}</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className={clsx('relative rounded-md focus:outline-none focus:ring-2 focus:ring-white', text)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 px-4 py-6 sm:px-6 overflow-y-auto bg-white">
                  {content}
                </div>
                <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:px-6 gap-3">
                  <Button
                    className="cursor-pointer"
                    onClick={primaryAction.onClick}
                    color={primaryAction.color || 'blue'}
                  >
                    {primaryAction.label}
                  </Button>
                  {secondaryAction && (
                    <Button
                      className="cursor-pointer"
                      onClick={secondaryAction.onClick}
                      outline
                    >
                      {secondaryAction.label}
                    </Button>
                  )}
                </div>
              </DialogPanel>
            </div>
          )}

          {!isPanel && (
            <DialogPanel transition className={clsx(commonPanelClasses, dialogPanelClasses)}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {Icon && (
                    <div
                      className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Icon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                  )}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {title}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{content}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse sm:px-6 gap-3">
                <Button
                  className="cursor-pointer"
                  onClick={primaryAction.onClick}
                  color={primaryAction.color || 'blue'}
                >
                  {primaryAction.label}
                </Button>
                {secondaryAction && (
                  <Button
                    className="cursor-pointer"
                    onClick={secondaryAction.onClick}
                    outline
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            </DialogPanel>
          )}
        </div>
      </div>
    </Dialog>
  );
};