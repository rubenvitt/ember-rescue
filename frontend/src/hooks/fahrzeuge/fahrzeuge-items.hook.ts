import { useMemo } from 'react';
import { useFahrzeuge } from './fahrzeuge.hook.js';
import { DefaultOptionType } from 'antd/lib/select/index.js';
import { VehicleOnMissionDto } from '@bluelight-hub/shared/client/index.js';

interface Props {
  fahrzeuge?: VehicleOnMissionDto[];
  include?: ('fahrzeugeImEinsatz' | 'fahrzeugeNichtImEinsatz' | 'alleFahrzeuge' | 'custom' | 'einsatztagebuch')[];
}

function convertToItems(fahrzeuge?: VehicleOnMissionDto[]) {
  if (!fahrzeuge) {
    return [];
  } else {
    return fahrzeuge.map((item) => {
      return {
        label: item.optaFunktion,
        value: item.fullOpta,
        title: item.optaFunktion,
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
  const { fahrzeuge: allFahrzeuge } = useFahrzeuge();

  const allFahrzeugeItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('alleFahrzeuge') ? convertToItems([...(allFahrzeuge.data?.data.fahrzeugeImEinsatz ?? []), ...(allFahrzeuge.data?.data.verfuegbareFahrzeuge ?? [])]) : [];
  }, [_include, allFahrzeuge.data]);
  const fahrzeugeImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('fahrzeugeImEinsatz') ? convertToItems(allFahrzeuge.data?.data.fahrzeugeImEinsatz) : [];
  }, [_include, allFahrzeuge.data]);
  const fahrzeugeNichtImEinsatzItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('fahrzeugeNichtImEinsatz') ? convertToItems(allFahrzeuge.data?.data.verfuegbareFahrzeuge) : [];
  }, [_include, allFahrzeuge.data]);
  const customFahrzeugeItems = useMemo<DefaultOptionType[]>(() => {
    return _include.includes('custom') ? convertToItems(fahrzeuge) : [];
  }, [_include, fahrzeuge]);

  const fahrzeugeAsItems = useMemo<DefaultOptionType[]>(() => {
    return [...customFahrzeugeItems, ...fahrzeugeImEinsatzItems, ...fahrzeugeNichtImEinsatzItems, ...allFahrzeugeItems].filter(
      (item, index, self) => index === self.findIndex((t) => t.value === item.value),
    );
  }, []) as DefaultOptionType[];

  console.log({ fahrzeugeAsItems, allFahrzeugeItems, fahrzeugeImEinsatzItems, fahrzeugeNichtImEinsatzItems, customFahrzeugeItems });

  return { fahrzeugeAsItems, loading: allFahrzeuge.isLoading };
}
