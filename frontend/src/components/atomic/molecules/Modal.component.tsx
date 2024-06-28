import React from 'react';
import { Button } from '../../catalyst-components/button.js';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import clsx from 'clsx';

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
}

const ModalComponent: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                content,
                                                primaryAction,
                                                secondaryAction,
                                                Icon,
                                                fullWidth,
                                              }) => {
  return (
    <Dialog className="relative z-10" open={isOpen} onClose={onClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto mt-16">
        <div
          className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:py-0 lg:ml-72 px-6">
          <DialogPanel
            transition
            className={clsx(
              fullWidth ? 'w-full' : 'sm:max-w-lg',
              'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95')}
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                {Icon &&
                  <div
                    className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Icon className="h-6 w-6" />
                  </div>
                }
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    {title}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {content}
                    </p>
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
                  outline>
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>


    // <Button
    //   className="cursor-pointer"
    //
    //   outline
    // >
    //
    // </Button>
    // <Button
    //   className="cursor-pointer"
    //
    //   color={primaryAction.color || 'blue'}
    // >
    //
    // </Button>
  );
};

export default ModalComponent;