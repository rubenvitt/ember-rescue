import { useMemo } from 'react';
import { useFahrzeuge } from './fahrzeuge.hook.js';
import { VehicleOnMissionDto } from '@ember-rescue/shared/client/index.js';

interface UseRecommendedFahrzeugeConfig {
  maxResults?: number;
  sortOrder?: 'asc' | 'desc';
}

function sortFahrzeugeByEinsatzCount(fahrzeugeNichtImEinsatz: VehicleOnMissionDto[], sortOrder: 'asc' | 'desc') {
  return fahrzeugeNichtImEinsatz.sort((a, b) => {
    const sortValue = a._count.einsatz_fahrzeug - b._count.einsatz_fahrzeug;
    return sortOrder === 'asc' ? sortValue : -sortValue;
  });
}

export const useRecommendedFahrzeuge = (config: UseRecommendedFahrzeugeConfig = {}) => {
  const { fahrzeuge } = useFahrzeuge();
  const { maxResults = 6, sortOrder = 'desc' } = config;

  return useMemo(() => {
    if (!fahrzeuge.data) return [];
    const sortedFahrzeuge = sortFahrzeugeByEinsatzCount([...fahrzeuge.data.data.verfuegbareFahrzeuge, ...fahrzeuge.data.data.fahrzeugeImEinsatz], sortOrder);
    return sortedFahrzeuge.slice(0, maxResults).map((fahrzeug) => ({
      label: fahrzeug.fullOpta,
      secondary: `${fahrzeug.optaFunktion} (${fahrzeug.kapazitaet} Plätze)`,
      item: fahrzeug,
    }));
  }, [fahrzeuge.data, maxResults, sortOrder]);
};
