import { useMemo } from 'react';
import { useEinheiten } from './einheiten.hook.js';
import { EinheitDto } from '../../types/types.js';

function sortEinheitenByEinsatzCount(einheitenNichtImEinsatz: EinheitDto[]) {
  return einheitenNichtImEinsatz.sort((a, b) => b._count.einsatz_einheit - a._count.einsatz_einheit);
}

export const useRecommendedEinheiten = () => {
  const { einheitenNichtImEinsatz } = useEinheiten();

  return useMemo(() => {
    return sortEinheitenByEinsatzCount(einheitenNichtImEinsatz).slice(0, 6)
      .map((einheit) => ({
        label: einheit.funkrufname,
        secondary: `${einheit.einheitTyp.label} (${einheit.kapazitaet} Plätze)`,
        item: einheit,
      }));
  }, [einheitenNichtImEinsatz]);
};