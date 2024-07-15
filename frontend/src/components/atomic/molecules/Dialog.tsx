import React, { useState } from 'react';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type DialogVariant = 'success' | 'error' | 'info' | 'warning' | 'critical';

interface BaseAction {
  label: string;
  onClick?: () => void;
  variant?: DialogVariant;
}

interface PrimaryAction extends BaseAction {
  primary: true;
}

interface SecondaryAction extends BaseAction {
  primary?: false;
}

type DialogActions =
  | [...SecondaryAction[], PrimaryAction]
  | SecondaryAction[]
  | [];

interface FlexibleDialogProps {
  title: string;
  message: string;
  variant: DialogVariant;
  actions?: DialogActions;
  size?: 'sm' | 'md' | 'lg';
  children: (props: { open: () => void }) => React.ReactNode;
  asPanel?: boolean;
}

const variantStyles = {
  success: 'bg-green-100 text-green-600',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-yellow-100 text-yellow-600',
  critical: 'bg-red-100 text-red-600',
};

const buttonVariantStyles = {
  success: 'bg-green-600 hover:bg-green-500 focus:ring-green-500',
  error: 'bg-red-600 hover:bg-red-500 focus:ring-red-500',
  info: 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500',
  warning: 'bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500',
  critical: 'bg-red-600 hover:bg-red-500 focus:ring-red-500',
};

const variantIcons = {
  success: CheckCircleIcon,
  error: XMarkIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  critical: ExclamationCircleIcon,
};

export const FlexibleDialog: React.FC<FlexibleDialogProps> = ({
                                                                title,
                                                                message,
                                                                variant,
                                                                actions = [],
                                                                size = 'md',
                                                                children,
                                                                asPanel = false,
                                                              }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = variantIcons[variant];

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const primaryAction = actions.find((action): action is PrimaryAction => 'primary' in action && action.primary === true);
  const secondaryActions = actions.filter((action): action is SecondaryAction => !('primary' in action) || !action.primary);

  const handleActionClick = (action: BaseAction) => {
    if (action.onClick) {
      action.onClick();
    }
    close();
  };

  const getButtonStyle = (action: BaseAction) => {
    if ('primary' in action && action.primary) {
      return buttonVariantStyles[action.variant || variant];
    }
    return 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50';
  };

  const Content = () => (
    <>
      <div
        className={`${asPanel ? 'bg-primary-700 px-4 py-6 sm:px-6' : 'bg-white dark:bg-gray-950 px-4 pb-4 pt-5 sm:p-6 sm:pb-4'}`}>
        <div className={`${asPanel ? '' : 'sm:flex sm:items-start'}`}>
          {!asPanel && (
            <div
              className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${variantStyles[variant]} sm:mx-0 sm:h-10 sm:w-10`}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
          <div className={`${asPanel ? '' : 'mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'}`}>
            <Dialog.Title
              as="h3"
              className={`text-base font-semibold leading-6 ${asPanel ? 'text-white' : 'text-gray-900'}`}
            >
              {title}
            </Dialog.Title>
            <div className="mt-2">
              <p className={`text-sm ${asPanel ? 'text-primary-300' : 'text-gray-500'}`}>{message}</p>
            </div>
          </div>
          {asPanel && (
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                onClick={close}
                className="relative rounded-md bg-primary-700 text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
      {actions.length > 0 && (
        <div
          className={`${asPanel ? 'border-t border-gray-200 px-4 py-6 sm:px-6' : 'bg-gray-50 dark:bg-gray-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'}`}>
          {primaryAction && (
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${getButtonStyle(primaryAction)}`}
              onClick={() => handleActionClick(primaryAction)}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryActions.map((action, index) => (
            <button
              key={index}
              type="button"
              className={`mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto ${getButtonStyle(action)}`}
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      {children({ open })}
      <Transition.Root show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={close}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className={`flex min-h-full ${asPanel ? 'items-stretch justify-end' : 'items-end justify-center p-4 text-center sm:items-center sm:p-0'}`}>
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom={asPanel ? 'translate-x-full' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
                enterTo={asPanel ? 'translate-x-0' : 'opacity-100 translate-y-0 sm:scale-100'}
                leave="ease-in duration-200"
                leaveFrom={asPanel ? 'translate-x-0' : 'opacity-100 translate-y-0 sm:scale-100'}
                leaveTo={asPanel ? 'translate-x-full' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}
              >
                {asPanel ? (
                  <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-950 shadow-xl">
                      <Content />
                    </div>
                  </DialogPanel>
                ) : (
                  <Dialog.Panel
                    className={`relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-950 text-left shadow-xl transition-all sm:my-8 sm:w-full ${
                      size === 'sm' ? 'sm:max-w-sm' : size === 'md' ? 'sm:max-w-md' : 'sm:max-w-lg'
                    }`}
                  >
                    <Content />
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};