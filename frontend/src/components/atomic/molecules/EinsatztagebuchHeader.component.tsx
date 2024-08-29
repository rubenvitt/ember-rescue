import React from 'react';
import { Button } from 'antd';

export const EinsatztagebuchHeaderComponent: React.FC<{
  inputVisible: boolean;
  setInputVisible: (visible: boolean) => void
}> = ({ inputVisible, setInputVisible }) => (
  <div className="sm:flex sm:items-center">
    <div className="sm:flex-auto">
      <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Einträge im ETB</h1>
    </div>
    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <Button
        color={inputVisible ? 'red' : 'primary'}
        danger={inputVisible}
        onClick={() => setInputVisible(!inputVisible)}
        type={inputVisible ? 'default' : "primary"}
        className="cursor-pointer"
      >
        {inputVisible ? 'Abbrechen' : 'Eintrag anlegen'}
      </Button>
    </div>
  </div>
);