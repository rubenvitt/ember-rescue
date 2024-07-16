import React, { useEffect, useMemo, useState } from 'react';
import mapboxgl, { IControl, LayerSpecification, Map } from 'mapbox-gl';
import { PiMapPin, PiMouse, PiWarningDiamond } from 'react-icons/pi';
import { createRoot } from 'react-dom/client';
import { formatMGRS, mgrs } from '../../../../lib/coordinates.js';
import { useToggle } from '@reactuses/core';
import { create } from 'zustand';
import clsx from 'clsx';
import { backendFetch } from '../../../../lib/http.js';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../routes/__root.js';

const useMapStore = create<{ map?: Map, setMap: (map: Map) => void }>((set) => ({
  setMap: (map) => set({ map: map }),
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
      return backendFetch<any[]>('/apis/bund/nina/warnings');
    },
    staleTime: 30 * 60 * 1000, // 30 Minuten
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  return (
    <>
      <button title={`Katwarnungen ${katwarnungenSichtbar ? 'entfernen' : 'hinzufügen'}`}
              className={clsx(
                'p-2 cursor-pointer rounded',
                katwarnungenSichtbar && 'text-primary-500',
                !katwarnungenSichtbar && 'hover:bg-gray-100',
              )}
              onClick={() => {
                if (!katwarnungenSichtbar) {
                  map?.addLayer(katwarnLayer);

                  map?.on('click', 'warnings-layer', (e) => {
                    console.log('you have clicked on', e.features.map(feature => feature.properties));
                    const clickedWarnIds = e.features.map(f => f.properties.warnId) as string[];
                    new mapboxgl.Popup({}).setLngLat(e.lngLat).setHTML(`${warnDetails.data?.filter(detail => clickedWarnIds.includes(detail.identifier)).map(detail => {
                      console.log('searching detail', detail);
                      return detail.info.filter(info => (info.language as String)?.includes?.('DE') ?? true).map(info => {
                        return `<div class="scroll-y-auto max-h-48 overflow-y-scroll">
                        <p>${info.headline} (${(info.category as String[]).join(', ')}) ${info.description} ${info.instruction}} ${info.senderName}<a href="${info.web?.startsWith('http') ? info.web : 'https://' + info.web}">${info.web}</a> </p></div>`;
                      });
                    })}`).addTo(map);
                  });
                } else {
                  map?.removeLayer('warnings-layer');
                }
                toggleKatwarnungen();
              }}>
        <PiWarningDiamond size={20} />
      </button>
    </>
  );
};

interface MyControlComponentProps {
  map: Map;
}

const MyControlComponent: React.FC<MyControlComponentProps> = ({ map }) => {
  const [mouseLngLat, setMouseLngLat] = useState(map.getCenter());
  const [mapCenterLngLat, setMapCenterLngLat] = useState(map.getCenter());
  const { setMap } = useMapStore();
  const geoJson = useQuery<GeoJSON.GeoJSON>({
    queryKey: ['warnings', 'geojson'],
    queryFn: async () => {
      const d = await backendFetch<GeoJSON.GeoJSON>('/apis/bund/nina/warnings.geojson');
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
  const warnDetails = useQuery<unknown[]>({
    queryKey: ['warnings', 'details'],
    queryFn: () => {
      return backendFetch<unknown[]>('/apis/bund/nina/warnings');
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
    return formatMGRS(mgrs(mouseLngLat));
  }, [mouseLngLat]);

  const centerCoordinates = useMemo(() => {
    return formatMGRS(mgrs(mapCenterLngLat));
  }, [mouseLngLat]);

  return <>
    <div className="rounded-xl bg-white mapboxgl-ctrl p-2">
      <h3 className="font-bold">Positionierung</h3>
      <p><PiMouse size={16} className="inline" />: {mouseCoordinates}</p>
      <p><PiMapPin size={16} className="inline" />: {centerCoordinates}</p>
    </div>

    <div className="rounded bg-white mapboxgl-ctrl">
      <IconComponent />
    </div>
  </>;
};

export class MyControl implements IControl {
  getDefaultPosition?: () => 'top-right';
  private container: HTMLElement | null = null;

  constructor() {
  }

  onAdd: (map: Map) => HTMLElement = (map: Map) => {
    this.container = document.createElement('div');

    const root = createRoot(this.container);
    root.render(<QueryClientProvider client={queryClient}><MyControlComponent map={map} /></QueryClientProvider>);

    return this.container;
  };

  onRemove: (map: Map) => void = (map) => {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  };
}