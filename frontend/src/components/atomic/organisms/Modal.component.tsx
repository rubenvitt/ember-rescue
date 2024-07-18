import React from 'react';
import { Dialog } from '@headlessui/react';
import { useModal } from '../../../hooks/modal.hook.js';
import { DialogBackdrop } from '../atoms/Backdrop.component.js';
import { PanelModal } from './modal/PanelModal.component.js';
import { DialogModal } from './modal/DialogModal.component.js';

export const Modal: React.FC = () => {
  const { modalConfig, closeModal, isOpen } = useModal();

  if (!modalConfig) return null;

  const {
    variant,
    ...rest
  } = modalConfig;

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="relative z-50"
    >
      <DialogBackdrop />

      {variant === 'panel' ? (
        <PanelModal {...rest} closeModal={closeModal} />) : <DialogModal {...rest} />}
    </Dialog>
  );
};