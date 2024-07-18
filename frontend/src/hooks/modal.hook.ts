import { useModalStore } from '../store/modal.store.js';

export const useModal = () => {
  const { modalConfig, openModal, closeModal } = useModalStore();

  return {
    modalConfig,
    openModal,
    closeModal,
    isOpen: !!modalConfig,
  };
};