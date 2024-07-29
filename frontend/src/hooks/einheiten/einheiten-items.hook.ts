import { EinheitDto } from '../../types/app/einheit.types.js';
import { useMemo } from 'react';
import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import { useEinheiten } from './einheiten.hook.js';

interface Props {
  einheiten?: EinheitDto[];
  include?: ('einheitenImEinsatz' | 'einheitenNichtImEinsatz' | 'alleEinheiten' | 'custom' | 'einsatztagebuch')[];
}

export const einsatztagebuchItem: ItemType<EinheitDto> = {
  item: {
    id: 'ETB',
    einheitTyp: { id: 'ETB', label: 'ETB' },
    kapazitaet: 0,
    istTemporaer: false,
    status: { id: 'none', code: 'none', bezeichnung: 'None' },
    funkrufname: 'ETB',
    _count: { einsatz_einheit: 0 },
  },
  label: 'ETB',
  secondary: 'Einsatztagebuch',
};

function convertToItems(einheiten?: EinheitDto[]) {
  if (!einheiten) {
    return [];
  } else {
    return einheiten.map(item => ({
      item,
      label: item.funkrufname,
      secondary: item.einheitTyp.label,
    }) as ItemType<EinheitDto>);
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

  const allEinheitenItems = useMemo<ItemType<EinheitDto>[]>(() => {
    return _include.includes('alleEinheiten') ? convertToItems(allEinheiten.data) : [];
  }, [_include, allEinheiten.data]);
  const einheitenImEinsatzItems = useMemo<ItemType<EinheitDto>[]>(() => {
    return _include.includes('einheitenImEinsatz') ? convertToItems(einheitenImEinsatz.data) : [];
  }, [_include, einheitenImEinsatz]);
  const einheitenNichtImEinsatzItems = useMemo<ItemType<EinheitDto>[]>(() => {
    return _include.includes('einheitenNichtImEinsatz') ? convertToItems(einheitenNichtImEinsatz) : [];
  }, [_include, einheitenNichtImEinsatz]);
  const customEinheitenItems = useMemo<ItemType<EinheitDto>[]>(() => {
    return _include.includes('custom') ? convertToItems(einheiten) : [];
  }, [_include, einheiten]);
  const einsatztagebuchItems = useMemo<ItemType<EinheitDto>[]>(() => {
    return _include.includes('einsatztagebuch') ? [einsatztagebuchItem] : [];
  }, [_include]);

  const einheitenAsItems = useMemo<ItemType<EinheitDto>[]>(() => {
    return [
      ...einsatztagebuchItems,
      ...customEinheitenItems,
      ...einheitenImEinsatzItems,
      ...einheitenNichtImEinsatzItems,
      ...allEinheitenItems,
    ].filter((item, index, self) =>
      index === self.findIndex((t) => t.item.id === item.item.id),
    );
  }, []) as ItemType<EinheitDto>[];

  return { einheitenAsItems };
}