import React from 'react';
import { useBearbeiter } from '../../../../hooks/bearbeiter.hook.js';
import { Image } from 'antd';

interface EinsatzHeaderProps {
  einsatzOffen: boolean;
}

export const SetupEinsatzHeader: React.FC<EinsatzHeaderProps> = ({ einsatzOffen }) => {
  const { bearbeiter } = useBearbeiter();
  return (
    <div data-tauri-drag-region className="flex w-full flex-col items-center bg-primary-800 dark:bg-primary-950">
      <div data-tauri-drag-region className="flex w-full max-w-6xl gap-16 pb-12 pt-24">
        <div className="px-6 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <h2 className="mt-2 flex items-center text-4xl font-bold tracking-tight text-white sm:text-6xl dark:text-gray-100">
              <Image src="/brandbook/mobile-white.png" preview={false} className="rounded-xl" wrapperClassName="w-24 rounded-xl" alt="Bluelight Hub Logo" />
              <span className="ml-4">Bluelight Hub</span>
            </h2>
            <div className="ml-28 mt-6 text-lg leading-8 text-white">
              <p>
                Angemeldet als Bearbeiter: <strong className="text-primary-300">{bearbeiter.data?.data.name}</strong>
              </p>
              <p>Anlegen eines neuen Einsatzes {einsatzOffen && ' - es existieren offene Einsätze'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
