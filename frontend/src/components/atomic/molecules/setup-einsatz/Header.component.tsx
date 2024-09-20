import React from 'react';
import { useBearbeiter } from '../../../../hooks/bearbeiter.hook.js';

interface EinsatzHeaderProps {
  einsatzOffen: boolean;
}

export const SetupEinsatzHeader: React.FC<EinsatzHeaderProps> = ({ einsatzOffen }) => {
  const { bearbeiter } = useBearbeiter();
  return (
    <div className="mt-12 px-6 pt-24 sm:pt-32 lg:px-8">
      <div className="mx-auto lg:mx-0">
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">
          Einsatz anlegen{einsatzOffen && ' | fortsetzen'}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          Anlegen eines neuen Einsatzes ({bearbeiter.data?.name}){einsatzOffen && ' - es existieren offene Einsätze'}
        </p>
      </div>
    </div>
  );
};
