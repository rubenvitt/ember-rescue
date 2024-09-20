import { EinheitDto } from '../../types/app/einheit.types.js';
import { useMemo } from 'react';
import { useEinheiten } from './einheiten.hook.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';

interface Props {
  einheiten?: EinheitDto[];
  include?: ('einheitenImEinsatz' | 'einheitenNichtImEinsatz' | 'alleEinheiten' | 'custom' | 'einsatztagebuch')[];
}

function convertToItems(einheiten?: EinheitDto[]) {
  if (!einheiten) {
    return [];
  } else {
    return einheiten.map((item) => {
      return {
        label: item.funkrufname,
        value: item.id,
        title: item.funkrufname,
        item,
        // item,
        // label: item.funkrufname,
        // secondary: item.einheitTyp.label,
      } satisfies DefaultOptionType;
    });
  }
}

export function useEinheitenItems({ einheiten, include }: Props) {
  // if einheiten, set include (if not set to anything) to 'custom'; alse to 'alleEinheiten'
  const _include = useMemo(() => {
    if (!include && einheiten) {
      return ['custom'];
    } else if (!include) {
      return ['alleEinheiten'];
    }
    return include;
  }, [include, einheiten]);
  const { einheiten: allEinheiten, einheitenImEinsatz, einheitenNichtImEinsatz } = useEinheiten();

  const allEinheitenItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('alleEinheiten') ? convertToItems(allEinheiten.data) : [];
  }, [_include, allEinheiten.data]);
  const einheitenImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('einheitenImEinsatz') ? convertToItems(einheitenImEinsatz.data) : [];
  }, [_include, einheitenImEinsatz]);
  const einheitenNichtImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('einheitenNichtImEinsatz') ? convertToItems(einheitenNichtImEinsatz) : [];
  }, [_include, einheitenNichtImEinsatz]);
  const customEinheitenItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('custom') ? convertToItems(einheiten) : [];
  }, [_include, einheiten]);

  const einheitenAsItems = useMemo<DefaultOptionType[]>(() => {
    return [
      ...customEinheitenItems,
      ...einheitenImEinsatzItems,
      ...einheitenNichtImEinsatzItems,
      ...allEinheitenItems,
    ].filter((item, index, self) => index === self.findIndex((t) => t.value === item.value));
  }, []) as DefaultOptionType[];

  return { einheitenAsItems, loading: allEinheiten.isLoading || einheitenImEinsatz.isLoading };
}
