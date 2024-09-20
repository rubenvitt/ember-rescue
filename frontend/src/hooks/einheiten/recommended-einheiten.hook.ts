import { useMemo } from 'react';
import { useEinheiten } from './einheiten.hook.js';

import { EinheitDto } from '../../types/app/einheit.types.js';

interface UseRecommendedEinheitenConfig {
  maxResults?: number;
  sortOrder?: 'asc' | 'desc';
}

function sortEinheitenByEinsatzCount(einheitenNichtImEinsatz: EinheitDto[], sortOrder: 'asc' | 'desc') {
  return einheitenNichtImEinsatz.sort((a, b) => {
    const sortValue = a._count.einsatz_einheit - b._count.einsatz_einheit;
    return sortOrder === 'asc' ? sortValue : -sortValue;
  });
}

export const useRecommendedEinheiten = (config: UseRecommendedEinheitenConfig = {}) => {
  const { einheitenNichtImEinsatz } = useEinheiten();
  const { maxResults = 6, sortOrder = 'desc' } = config;

  return useMemo(() => {
    const sortedEinheiten = sortEinheitenByEinsatzCount(einheitenNichtImEinsatz, sortOrder);
    return sortedEinheiten.slice(0, maxResults).map((einheit) => ({
      label: einheit.funkrufname,
      secondary: `${einheit.einheitTyp.label} (${einheit.kapazitaet} Plätze)`,
      item: einheit,
    }));
  }, [einheitenNichtImEinsatz, maxResults, sortOrder]);
};
