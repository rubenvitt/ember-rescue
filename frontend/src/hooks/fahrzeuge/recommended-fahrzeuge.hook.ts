import { useMemo } from 'react';
import { useFahrzeuge } from './fahrzeuge.hook.js';
import { VehicleOnMissionDto } from '@bluelight-hub/shared/client/index.js';

interface UseRecommendedFahrzeugeConfig {
  maxResults?: number;
  sortOrder?: 'asc' | 'desc';
}

// TODO[ember-rescue-68](rubeen, 19.01.2025): sortOrder is not used, implement it
function sortFahrzeugeByEinsatzCount(fahrzeugeNichtImEinsatz: VehicleOnMissionDto[], _sortOrder: 'asc' | 'desc') {
  return fahrzeugeNichtImEinsatz.sort((a, b) => {
    // FIXME[ember-rescue-68](rubeen, 31.12.24): try to reimplement _count (need to do that in backend)
    // const sortValue = a._count.einsatz_fahrzeug - b._count.einsatz_fahrzeug;
    // return sortOrder === 'asc' ? sortValue : -sortValue;
    return a.fullOpta?.localeCompare(b.fullOpta, undefined, { sensitivity: 'base', usage: 'sort' });
  });
}

export const useRecommendedFahrzeuge = (config: UseRecommendedFahrzeugeConfig = {}) => {
  const { fahrzeuge } = useFahrzeuge();
  const { maxResults = 6, sortOrder = 'desc' } = config;

  return useMemo(() => {
    if (!fahrzeuge.data) return [];
    const sortedFahrzeuge = sortFahrzeugeByEinsatzCount([...fahrzeuge.data.data.verfuegbareFahrzeuge], sortOrder);
    return sortedFahrzeuge.slice(0, maxResults).map((fahrzeug) => ({
      label: fahrzeug.fullOpta,
      secondary: `${fahrzeug.optaFunktion} ${fahrzeug.kapazitaet ? `(${fahrzeug.kapazitaet} Plätze)` : ''}`,
      item: fahrzeug,
    }));
  }, [fahrzeuge.data, maxResults, sortOrder]);
};
