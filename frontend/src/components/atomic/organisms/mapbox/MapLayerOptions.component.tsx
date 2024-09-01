import { LayerSpecification, Map, RasterSourceSpecification } from 'mapbox-gl';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../../routes/__root.js';
import { Dropdown, MenuProps, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { PiMapPinThin } from 'react-icons/pi';
import { useMapStore } from './Controls.js';

interface LayerConfig {
  layer: Omit<LayerSpecification, 'id' | 'source'>;
  source: Omit<RasterSourceSpecification, 'id'> & { type: 'raster' };
  label: string;
}

const layerConfigurations: Record<string, LayerConfig> = {
  'osm': {
    layer: {
      type: 'raster',
      paint: {},
    },
    source: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
    label: 'OSM Source',
  },
  'osm-fr': {
    layer: {
      type: 'raster',
      paint: {},
    },
    source: {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', 'https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png/'],
      tileSize: 256,
    },
    label: 'OSM.fr Source',
  },
  'open-cycle': {
    layer: {
      type: 'raster',
      paint: {},
    },
    source: {
      type: 'raster',
      tiles: ['http://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
    label: 'Open Cycle Map',
  },
  'openTopoMap': {
    layer: {
      type: 'raster',
      paint: {},
    },
    source: {
      type: 'raster',
      tiles: ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png', 'https://b.tile.opentopomap.org/{z}/{x}/{y}.png', 'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
    label: 'Open Topo Map',
  },
  'basemap': {
    layer: {
      type: 'raster',
      paint: {},
    },
    source: {
      type: 'raster',
      tiles: ['https://sgx.geodatenzentrum.de/wmts_basemapde/tile/1.0.0/de_basemapde_web_raster_farbe/default/GLOBAL_WEBMERCATOR/{z}/{y}/{x}.png'],
      tileSize: 256,
    },
    label: 'Basemap Raster',
  },
  'topplus-open': {
    layer: {
      type: 'raster',
      paint: {},
    },
    source: {
      type: 'raster',
      tiles: ['https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web/default/WEBMERCATOR/{z}/{y}/{x}.png'],
      tileSize: 256,
    },
    label: 'Top Plus Open',
  },
};


function toggleLayer(map: Map, layerName: keyof typeof layerConfigurations, setActiveLayer: (layer: string) => void) {
  Object.keys(layerConfigurations).forEach(key => {
    const layerId = `${key}-layer`;

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  });

  const config = layerConfigurations[layerName];
  if (!config) {
    setActiveLayer('');
    return;
  }

  const layerId = `${layerName}-layer`;
  const sourceId = `${layerName}-source`;

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, config.source);
  }
  map.addLayer({ ...config.layer, id: layerId, source: sourceId });

  setActiveLayer(layerName);
}

function removeLayer(map: Map, layerName: keyof typeof layerConfigurations) {
  const layerId = `${layerName}-layer`;

  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }

  const sourceId = `${layerName}-source`;

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

export const MapLayerOptions: React.FC<{ map: Map }> = ({ map }) => {
  const { setMap } = useMapStore();
  const [activeLayer, setActiveLayer] = useState<string>('');

  useEffect(() => {
    setMap(map);
    Object.keys(layerConfigurations).forEach(key => {
      const sourceId = `${key}-source`;
      const config = layerConfigurations[key as keyof typeof layerConfigurations];
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, config.source);
      }
    });
  }, [map]);

  const items: MenuProps['items'] = Object.keys(layerConfigurations).map(key => ({
    key,
    onClick: () => toggleLayer(map, key as keyof typeof layerConfigurations, setActiveLayer),
    label: (
      <span>
        {layerConfigurations[key as keyof typeof layerConfigurations].label}
        {activeLayer === key && ' (Active)'}
      </span>
    ),
  }));

  // Menu item to remove all layers
  items.push({
    key: 'remove-all',
    onClick: () => {
      Object.keys(layerConfigurations).forEach(key => removeLayer(map, key as keyof typeof layerConfigurations));
      setActiveLayer('');
    },
    label: 'Remove all layers'
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip title="Map Layer umschalten">
        <Dropdown menu={{ items }}>
          <div className="rounded bg-white mapboxgl-ctrl">
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 cursor-pointer rounded">
              <PiMapPinThin size={20} />
            </button>
          </div>
        </Dropdown>
      </Tooltip>
    </QueryClientProvider>
  );
};