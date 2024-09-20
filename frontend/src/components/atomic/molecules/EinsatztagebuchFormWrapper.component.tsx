import React from 'react';
import { Transition } from '@headlessui/react';
import { EinsatztagebuchForm } from './EinsatztagebuchForm.component.js';

export const EinsatztagebuchFormWrapperComponent: React.FC<{ inputVisible: boolean; closeForm: () => void }> = ({
  inputVisible,
  closeForm,
}) => (
  <Transition show={inputVisible}>
    <div className="duration-50 mt-4 max-w-4xl border-t border-gray-200 pt-4 transition ease-in data-[closed]:opacity-0">
      <EinsatztagebuchForm closeForm={closeForm} />
    </div>
  </Transition>
);
