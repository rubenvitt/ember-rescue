import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${size === 'sm' ? 'sm:max-w-sm' : size === 'md' ? 'sm:max-w-md' : 'sm:max-w-lg'}`}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div
                        className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${variantStyles[variant]} sm:mx-0 sm:h-10 sm:w-10`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          {title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {actions.length > 0 && (
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};