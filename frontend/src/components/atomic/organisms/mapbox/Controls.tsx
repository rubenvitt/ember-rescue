import React, { useEffect, useMemo, useState } from 'react';
import mapboxgl, { IControl, Map } from 'mapbox-gl';
import { PiMapPin, PiMouse, PiWarningDiamond } from 'react-icons/pi';
import { createRoot } from 'react-dom/client';
import { formatMGRS, mgrs } from '../../../../lib/coordinates.js';
import { useToggle } from '@reactuses/core';
import { create } from 'zustand';

const useMapStore = create<{ map?: Map, setMap: (map: Map) => void }>((set) => ({
  setMap: (map) => set({ map: map }),
}));

// React-Komponente mit Icon
const IconComponent: React.FC = () => {
  const [katwarnungenSichtbar, toggleKatwarnungen] = useToggle(false);
  const { map } = useMapStore();

  return (
    <>
      <button title={`Katwarnungen ${katwarnungenSichtbar ? 'entfernen' : 'hinzufügen'}`}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded" onClick={() => {
        if (!katwarnungenSichtbar) {
          map?.addLayer({
            id: 'warnings-layer',
            type: 'fill',
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
          });

          map?.on('click', 'warnings-layer', (e) => {
            console.log('you have clicked on', e.features[0].properties);
            new mapboxgl.Popup({}).setLngLat(e.lngLat).setHTML(`You have clicked on ${JSON.stringify(e.features[0].properties)}`).addTo(map);
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

const MyControlComponent: React.FC = ({ map }: MyControlComponentProps) => {
  const [mouseLngLat, setMouseLngLat] = useState(map.getCenter());
  const [mapCenterLngLat, setMapCenterLngLat] = useState(map.getCenter());
  const { setMap } = useMapStore();

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

  onAdd: (map: Map) => HTMLElement = (map: Map) => {
    this.container = document.createElement('div');

    const root = createRoot(this.container);
    root.render(<MyControlComponent map={map} />);

    return this.container;
  };

  onRemove: (map: Map) => void = (map) => {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  };
}