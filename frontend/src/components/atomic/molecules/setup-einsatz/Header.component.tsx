import React from 'react';
import { useBearbeiter } from '../../../../hooks/bearbeiter.hook.js';
import { Image } from 'antd';

interface EinsatzHeaderProps {
  einsatzOffen: boolean;
}

export const SetupEinsatzHeader: React.FC<EinsatzHeaderProps> = ({ einsatzOffen }) => {
  const { bearbeiter } = useBearbeiter();
  return (
    <div className="mt-12 px-6 pt-24 sm:pt-32 lg:px-8">
      <div className="mx-auto lg:mx-0">
        <h2 className="mt-2 flex items-center text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">
          <Image
            src="/logo.png"
            preview={false}
            className="rounded-xl"
            wrapperClassName="bg-green-500 w-24 rounded-xl"
            alt="EmberRescue Logo"
          />
          <span className="ml-4">EmberRescue</span>
        </h2>
        <div className="ml-28 mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          <p>
            Angemeldet als Bearbeiter: <strong>{bearbeiter.data?.name}</strong>
          </p>
          <p>Anlegen eines neuen Einsatzes {einsatzOffen && ' - es existieren offene Einsätze'}</p>
        </div>
      </div>
    </div>
  );
};
