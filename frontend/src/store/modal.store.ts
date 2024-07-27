import { create } from 'zustand';
import { IsOpen, ModalConfig } from '../types/ui/modal.types.js';

interface ModalStore {
  modalConfig: (ModalConfig & IsOpen) | null;
  openModal: (config: Omit<ModalConfig, 'isOpen'>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalConfig: null,
  openModal: (config) => set({ modalConfig: { ...config, isOpen: true } }),
  closeModal: () => set({ modalConfig: null }),
}));