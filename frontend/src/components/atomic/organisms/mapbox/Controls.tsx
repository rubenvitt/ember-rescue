import React, { useCallback, useEffect, useMemo, useState } from 'react';
import mapboxgl, { IControl, LayerSpecification, Map, Marker } from 'mapbox-gl';
import { PiAmbulance, PiMapPin, PiMouse, PiWarningDiamond, PiX } from 'react-icons/pi';
import { createRoot } from 'react-dom/client';
import { formatMGRS, mgrs } from '../../../../utils/coordinates.js';
import { useToggle } from '@reactuses/core';
import { create } from 'zustand';
import clsx from 'clsx';
import { backendFetchJson } from '../../../../utils/http.js';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../routes/__root.js';
import { useFahrzeuge } from '../../../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { erzeugeTaktischesZeichen } from 'taktische-zeichen-core';
import { statusRgbColors } from '../../atoms/StatusLabel.component.js';
import { FahrzeugDto } from '../../../../types/app/fahrzeug.types.js';
import { MapLayerOptions } from './MapLayerOptions.component.tsx';

export const useMapStore = create<{
  map?: Map;
  setMap: (map: Map) => void;
  markerPerFahrzeug: { [fahrzeugId: string]: Marker };
  addMarkerForFahrzeug: (fahrzeugId: string, marker: Marker) => void;
  removeMarkerForFahrzeug: (fahrzeugId: string) => void;
  updateMarkerForFahrzeug: (fahrzeugId: string, marker: Marker) => void;
}>((set, get) => ({
  setMap: (map) => set({ map: map }),
  markerPerFahrzeug: {},
  addMarkerForFahrzeug: (fahrzeug, marker) =>
    set({
      markerPerFahrzeug: {
        ...get().markerPerFahrzeug,
        [fahrzeug]: marker,
      },
    }),
  removeMarkerForFahrzeug: (fahrzeug) =>
    set({
      markerPerFahrzeug: Object.fromEntries(
        Object.entries(get().markerPerFahrzeug).filter(([key]) => key !== fahrzeug),
      ),
    }),
  updateMarkerForFahrzeug: (fahrzeug, marker) =>
    set({ markerPerFahrzeug: get().markerPerFahrzeug, [fahrzeug]: marker }),
}));

// React-Komponente mit Icon
const katwarnLayer: LayerSpecification = {
  id: 'warnings-layer',
  type: 'fill',
  // type: 'circle',
  source: 'warnings',
  metadata: 'test',
  paint: {
    'fill-color': 'red',
    'fill-opacity': 0.25,
    // 'circle-radius': 4,
    // 'circle-stroke-width': 2,
    // 'circle-color': 'red',
    // 'circle-stroke-color': 'white',
  },
};

const IconComponent: React.FC = () => {
  const [katwarnungenSichtbar, toggleKatwarnungen] = useToggle(false);
  const { map } = useMapStore();
  const warnDetails = useQuery<any[]>({
    queryKey: ['warnings', 'details'],
    queryFn: () => {
      return backendFetchJson<any[]>('/apis/bund/nina/warnings');
    },
    staleTime: 30 * 60 * 1000, // 30 Minuten
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  return (
    <>
      <button
        title={`Katwarnungen ${katwarnungenSichtbar ? 'entfernen' : 'hinzufügen'}`}
        className={clsx(
          'cursor-pointer rounded p-2',
          katwarnungenSichtbar && 'text-primary-500',
          !katwarnungenSichtbar && 'hover:bg-gray-100',
        )}
        onClick={() => {
          if (!katwarnungenSichtbar) {
            map?.addLayer(katwarnLayer);

            map?.on('click', 'warnings-layer', (e: any) => {
              console.log(
                'you have clicked on',
                e.features.map((feature: any) => feature.properties),
              );
              const clickedWarnIds = e.features.map((f: any) => f.properties.warnId) as string[];
              new mapboxgl.Popup({})
                .setLngLat(e.lngLat)
                .setHTML(
                  `${warnDetails.data
                    ?.filter((detail) => clickedWarnIds.includes(detail.identifier))
                    .map((detail) => {
                      console.log('searching detail', detail);
                      return detail.info
                        .filter((info: any) => (info.language as String)?.includes?.('DE') ?? true)
                        .map((info: any) => {
                          return `<div class="scroll-y-auto max-h-48 overflow-y-scroll">
                        <p>${info.headline} (${(info.category as String[]).join(', ')}) ${info.description} ${info.instruction}} ${info.senderName}<a href="${info.web?.startsWith('http') ? info.web : 'https://' + info.web}">${info.web}</a> </p></div>`;
                        });
                    })}`,
                )
                .addTo(map);
            });
          } else {
            map?.removeLayer('warnings-layer');
          }
          toggleKatwarnungen();
        }}
      >
        <PiWarningDiamond size={20} />
      </button>
    </>
  );
};

interface MyControlComponentProps {
  map: Map;
}

function AddFahrzeugComponent() {
  const { fahrzeugeImEinsatz } = useFahrzeuge();
  const { map } = useMapStore();
  const randomFahrzeug = useMemo<FahrzeugDto | undefined>(() => {
    return fahrzeugeImEinsatz.data?.find(() => true);
  }, [fahrzeugeImEinsatz.data]);
  const [showFahrzeugeList, toggleShowFahrzeugeList] = useToggle(false);

  const addFahrzeugToMap = useCallback(
    (fahrzeug: FahrzeugDto) => {
      let element = document.createElement('div');
      let svg = erzeugeTaktischesZeichen({
        grundzeichen: 'fahrzeug',
        organisation: 'hilfsorganisation',
        fachaufgabe: 'iuk',
        name: fahrzeug.funkrufname,
        farbe: statusRgbColors[fahrzeug.status.code],
      }).svg;
      element.innerHTML = svg.render();
      element.className = 'w-20 h-20 text-red-500';
      element.id = `fahrzeug-${fahrzeug.funkrufname}`;
      map &&
        new mapboxgl.Marker({ element, draggable: true })
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div>${fahrzeug.fahrzeugTyp.label} ${fahrzeug.funkrufname} | ${formatMGRS(mgrs(map.getCenter())!)} <button onclick="console.log('should delete...')">Löschen</button></div>`,
            ),
          )
          .setLngLat(map.getCenter())
          .addTo(map);
    },
    [map],
  );

  if (!map || !randomFahrzeug) return null;

  if (showFahrzeugeList) {
    return (
      <>
        <button className="absolute right-0 top-0 m-2" onClick={toggleShowFahrzeugeList}>
          <PiX />
        </button>
        <div className="flex max-h-48 flex-col gap-2 overflow-y-scroll rounded p-2">
          {fahrzeugeImEinsatz.data?.map((fahrzeug) => {
            return (
              <button onClick={() => addFahrzeugToMap(fahrzeug)} className="p-2">
                {fahrzeug.funkrufname}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <button
      onClick={() => {
        toggleShowFahrzeugeList();
      }}
      className="cursor-pointer rounded p-2"
    >
      <PiAmbulance size={20} />
    </button>
  );

  //       const marker = new mapboxgl.Marker({
  //         color: 'green',
  //         draggable: true,
  //       }).setLngLat(map.getCenter()).addTo(map);
  //       addMarkerForFahrzeug(randomFahrzeug?.id, marker);
  //       marker.on('dragend', () => {
  //         console.log('marker is', marker.getLngLat());
  //       });
}

const MyControlComponent: React.FC<MyControlComponentProps> = ({ map }) => {
  const [mouseLngLat, setMouseLngLat] = useState(map.getCenter());
  const [mapCenterLngLat, setMapCenterLngLat] = useState(map.getCenter());
  const { setMap } = useMapStore();
  const geoJson = useQuery<GeoJSON.GeoJSON>({
    queryKey: ['warnings', 'geojson'],
    queryFn: async () => {
      const d = await backendFetchJson<GeoJSON.GeoJSON>('/apis/bund/nina/warnings.geojson');
      await queryClient.invalidateQueries({
        queryKey: ['warnings', 'details'],
      });
      return d;
    },
    staleTime: 30 * 60 * 1000, // 30 Minuten
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  useQuery<unknown[]>({
    queryKey: ['warnings', 'details'],
    queryFn: () => {
      return backendFetchJson<unknown[]>('/apis/bund/nina/warnings');
    },
    staleTime: 30 * 60 * 1000, // 30 Minuten
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  const [initiallyLoaded, setInitiallyLoaded] = useState(map.loaded());

  useEffect(() => {
    !initiallyLoaded && map.loaded() && setInitiallyLoaded(true);
  }, [map.loaded()]);

  useEffect(() => {
    console.log('map loaded', initiallyLoaded);
    if (geoJson.data && initiallyLoaded) {
      const layerVisible = Boolean(map.getLayer(katwarnLayer.id));
      console.log('layerVisible', layerVisible);
      if (map.getSource('warnings')) {
        map.removeLayer(katwarnLayer.id);
        map.removeSource('warnings');
      }

      map.addSource('warnings', {
        type: 'geojson',
        data: geoJson.data,
      });
      if (layerVisible) {
        map.addLayer(katwarnLayer);
      }
    }
  }, [geoJson.data, initiallyLoaded]);

  useEffect(() => {
    setMap(map);

    map.on('mousemove', (e: mapboxgl.MapMouseEvent) => {
      setMouseLngLat(e.lngLat);
    });

    map.on('move', () => {
      setMapCenterLngLat(map.getCenter());
    });
  }, [map]);

  const mouseCoordinates = useMemo(() => {
    return formatMGRS(mgrs(mouseLngLat)!);
  }, [mouseLngLat]);

  const centerCoordinates = useMemo(() => {
    return formatMGRS(mgrs(mapCenterLngLat)!);
  }, [mouseLngLat]);

  return (
    <>
      <div className="mapboxgl-ctrl rounded-xl bg-white p-2 dark:bg-gray-900">
        <h3 className="font-bold">Positionierung</h3>
        <p>
          <PiMouse size={16} className="inline" />: {mouseCoordinates}
        </p>
        <p>
          <PiMapPin size={16} className="inline" />: {centerCoordinates}
        </p>
      </div>

      <div className="mapboxgl-ctrl rounded bg-white dark:bg-gray-900">
        <IconComponent />
      </div>

      <div className="mapboxgl-ctrl rounded bg-white dark:bg-gray-900">
        <AddFahrzeugComponent />
      </div>
    </>
  );
};

export class RescueControl implements IControl {
  getDefaultPosition?: () => 'top-right';
  private container: HTMLElement | null = null;

  constructor() {}

  onAdd: (map: Map) => HTMLElement = (map: Map) => {
    this.container = document.createElement('div');

    const root = createRoot(this.container);
    root.render(
      <QueryClientProvider client={queryClient}>
        <MyControlComponent map={map} />
      </QueryClientProvider>,
    );

    return this.container;
  };

  onRemove: (map: Map) => void = () => {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  };
}

export class LayersControl implements IControl {
  getDefaultPosition?: () => 'bottom-left';
  private container: HTMLElement | null = null;

  onRemove(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }

  onAdd(map: Map): HTMLElement {
    this.container = document.createElement('div');
    const root = createRoot(this.container);

    root.render(<MapLayerOptions map={map} />);

    return this.container;
  }
}
