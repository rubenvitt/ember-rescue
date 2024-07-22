import React from 'react';
import { Button } from '../../deprecated/button.js';

export const EinsatztagebuchHeaderComponent: React.FC<{
  inputVisible: boolean;
  setInputVisible: (visible: boolean) => void
}> = ({ inputVisible, setInputVisible }) => (
  <div className="sm:flex sm:items-center">
    <div className="sm:flex-auto">
      <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Einträge im ETB</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Hier sollte vielleicht ein Inputfeld für das Anlegen neuer Einträge stehen und zusätzlich eine
        Filter- und Suchmöglichkeit für die Einträge.
      </p>
    </div>
    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <Button
        color={inputVisible ? 'red' : 'primary'}
        onClick={() => setInputVisible(!inputVisible)}
        type="button"
        className="cursor-pointer"
      >
        {inputVisible ? 'Abbrechen' : 'Eintrag anlegen'}
      </Button>
    </div>
  </div>
);