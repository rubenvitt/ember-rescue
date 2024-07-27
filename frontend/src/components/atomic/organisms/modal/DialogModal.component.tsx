import { DialogPanel, DialogTitle } from '@headlessui/react';
import { modalHeader, modalPanel } from '../../../../styles/modal.styles.js';
import { ModalContent } from '../../molecules/ModalContent.component.js';
import { ModalButton } from '../../atoms/ModalButton.component.js';
import { ModalConfig } from '../../../../types/ui/modal.types.js';

export function DialogModal({
                              title,
                              content,
                              primaryAction,
                              secondaryAction,
                              icon: Icon,
                              fullWidth,
                              panelColor,
                            }: ModalConfig) {
  const hasActions = primaryAction || secondaryAction;
  const variant = 'dialog';

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel className={modalPanel({ variant, fullWidth })}>
          <div className={modalHeader({ panelColor })}>
            <div className="sm:flex sm:items-start">
              {Icon && (
                <div
                  className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Icon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
              )}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6">
                  {title}
                </DialogTitle>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <ModalContent content={content} />
          </div>
          {hasActions && (
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
              {primaryAction && (
                <ModalButton onClick={primaryAction.onClick} color={primaryAction.color}>
                  {primaryAction.label}
                </ModalButton>
              )}
              {secondaryAction && (
                <ModalButton onClick={secondaryAction.onClick} color={secondaryAction.color}>
                  {secondaryAction.label}
                </ModalButton>
              )}
            </div>
          )}
        </DialogPanel>
      </div>
    </div>
  );
}