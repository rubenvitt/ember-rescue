import { useMemo } from 'react';
import { useFahrzeuge } from './fahrzeuge.hook.js';

import { FahrzeugDto } from '../../types/app/fahrzeug.types.js';

interface UseRecommendedFahrzeugeConfig {
  maxResults?: number;
  sortOrder?: 'asc' | 'desc';
}

function sortFahrzeugeByEinsatzCount(fahrzeugeNichtImEinsatz: FahrzeugDto[], sortOrder: 'asc' | 'desc') {
  return fahrzeugeNichtImEinsatz.sort((a, b) => {
    const sortValue = a._count.einsatz_fahrzeug - b._count.einsatz_fahrzeug;
    return sortOrder === 'asc' ? sortValue : -sortValue;
  });
}

export const useRecommendedFahrzeuge = (config: UseRecommendedFahrzeugeConfig = {}) => {
  const { fahrzeugeNichtImEinsatz } = useFahrzeuge();
  const { maxResults = 6, sortOrder = 'desc' } = config;

  return useMemo(() => {
    const sortedFahrzeuge = sortFahrzeugeByEinsatzCount(fahrzeugeNichtImEinsatz, sortOrder);
    return sortedFahrzeuge.slice(0, maxResults).map((fahrzeug) => ({
      label: fahrzeug.funkrufname,
      secondary: `${fahrzeug.fahrzeugTyp.label} (${fahrzeug.kapazitaet} Plätze)`,
      item: fahrzeug,
    }));
  }, [fahrzeugeNichtImEinsatz, maxResults, sortOrder]);
};
