import React from 'react';
import { PiSirenBold } from 'react-icons/pi';
import { OffeneEinsaetzeList } from '../../organisms/OffeneEinsaetzeList.component.js';

export const SetupEinsatzOffeneEinsaetze: React.FC = () => (
  <div className="w-full rounded-lg border border-primary-400 bg-gray-100/30 px-4 py-6 dark:bg-gray-900/30">
    <h2 className="mb-2 ml-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
      <PiSirenBold className="inline h-6 w-6 text-orange-400" /> Momentan offene Einsätze
    </h2>
    <OffeneEinsaetzeList />
  </div>
);
