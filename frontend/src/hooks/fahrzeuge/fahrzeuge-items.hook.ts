import { FahrzeugDto } from '../../types/app/fahrzeug.types.js';
import { useMemo } from 'react';
import { useFahrzeuge } from './fahrzeuge.hook.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';

interface Props {
  fahrzeuge?: FahrzeugDto[];
  include?: ('fahrzeugeImEinsatz' | 'fahrzeugeNichtImEinsatz' | 'alleFahrzeuge' | 'custom' | 'einsatztagebuch')[];
}

function convertToItems(fahrzeuge?: FahrzeugDto[]) {
  if (!fahrzeuge) {
    return [];
  } else {
    return fahrzeuge.map((item) => {
      return {
        label: item.funkrufname,
        value: item.id,
        title: item.funkrufname,
        item,
        // item,
        // label: item.funkrufname,
        // secondary: item.fahrzeugTyp.label,
      } satisfies DefaultOptionType;
    });
  }
}

export function useFahrzeugeItems({ fahrzeuge, include }: Props) {
  // if fahrzeuge, set include (if not set to anything) to 'custom'; alse to 'alleFahrzeuge'
  const _include = useMemo(() => {
    if (!include && fahrzeuge) {
      return ['custom'];
    } else if (!include) {
      return ['alleFahrzeuge'];
    }
    return include;
  }, [include, fahrzeuge]);
  const { fahrzeuge: allFahrzeuge, fahrzeugeImEinsatz, fahrzeugeNichtImEinsatz } = useFahrzeuge();

  const allFahrzeugeItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('alleFahrzeuge') ? convertToItems(allFahrzeuge.data) : [];
  }, [_include, allFahrzeuge.data]);
  const fahrzeugeImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('fahrzeugeImEinsatz') ? convertToItems(fahrzeugeImEinsatz.data) : [];
  }, [_include, fahrzeugeImEinsatz]);
  const fahrzeugeNichtImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('fahrzeugeNichtImEinsatz') ? convertToItems(fahrzeugeNichtImEinsatz) : [];
  }, [_include, fahrzeugeNichtImEinsatz]);
  const customFahrzeugeItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('custom') ? convertToItems(fahrzeuge) : [];
  }, [_include, fahrzeuge]);

  const fahrzeugeAsItems = useMemo<DefaultOptionType[]>(() => {
    return [
      ...customFahrzeugeItems,
      ...fahrzeugeImEinsatzItems,
      ...fahrzeugeNichtImEinsatzItems,
      ...allFahrzeugeItems,
    ].filter((item, index, self) => index === self.findIndex((t) => t.value === item.value));
  }, []) as DefaultOptionType[];

  return { fahrzeugeAsItems, loading: allFahrzeuge.isLoading || fahrzeugeImEinsatz.isLoading };
}
