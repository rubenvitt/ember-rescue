import { DialogPanel, DialogTitle } from '@headlessui/react';
import { modalCloseButton, modalHeader, modalPanel } from '../../../../styles/modal.styles.js';
import { XMarkIcon } from '@heroicons/react/24/outline/index.js';
import { ModalButton } from '../../atoms/ModalButton.component.js';
import { ModalConfig } from '../../../../types/ui/modal.types.js';
import { ModalContent } from '../../molecules/ModalContent.component.js';

export function PanelModal({
                             title,
                             content,
                             primaryAction,
                             secondaryAction,
                             closeModal,
                             fullWidth,
                             panelColor,
                           }: ModalConfig & { closeModal: () => void }) {
  const hasActions = primaryAction || secondaryAction;
  const variant = 'panel';

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <DialogPanel className={modalPanel({ variant, fullWidth })}>
            <div className="flex h-full flex-col overflow-y-scroll">
              <div className={modalHeader({ panelColor })}>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-semibold leading-6">{title}</DialogTitle>
                  <div className="ml-3 flex h-7 items-center">
                    <button type="button" className={modalCloseButton({ panelColor })} onClick={closeModal}>
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 px-4 py-6 sm:px-6 bg-white dark:bg-gray-800">
                <ModalContent content={content} />
              </div>
              {hasActions && (
                <div className="flex flex-shrink-0 justify-end px-4 py-4 bg-gray-50 dark:bg-gray-900 gap-2">
                  {secondaryAction && (
                    <ModalButton onClick={secondaryAction.onClick} color={secondaryAction.color}>
                      {secondaryAction.label}
                    </ModalButton>
                  )}
                  {primaryAction && (
                    <ModalButton onClick={primaryAction.onClick} color={primaryAction.color}>
                      {primaryAction.label}
                    </ModalButton>
                  )}
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </div>
  );
}