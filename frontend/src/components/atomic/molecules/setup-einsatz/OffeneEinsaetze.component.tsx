import React from 'react';
import { PiSirenBold } from 'react-icons/pi';
import { OffeneEinsaetzeList } from '../../organisms/OffeneEinsaetzeList.component.js';

export const SetupEinsatzOffeneEinsaetze: React.FC = () => (
  <div className="w-full bg-gray-100/30 dark:bg-gray-900/30 rounded-lg py-6 px-4 border border-primary-400">
    <h2 className="text-xl font-semibold mb-2 ml-2 tracking-tight text-gray-900 dark:text-gray-100">
      <PiSirenBold className="h-6 w-6 inline text-orange-400" /> Momentan offene Einsätze
    </h2>
    <OffeneEinsaetzeList />
  </div>
);