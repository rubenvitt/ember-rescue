import { queryClient } from '../../../../routes/__root.js';
import { Tooltip } from 'antd';
import { PiBellSimple, PiBellSimpleRinging, PiBellSimpleSlash } from 'react-icons/pi';
import { QueryClientProvider } from '@tanstack/react-query';
import { Map } from 'mapbox-gl';

export function WarningsOptions({}: { map: Map }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip title="Wetterwarnungen">
        <div className="mapboxgl-ctrl rounded bg-white dark:bg-gray-900">
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="cursor-pointer rounded p-2"
          >
            <PiBellSimple size={20} /> {/* keine aktive Warnung vorhanden */}
            <PiBellSimpleRinging size={20} /> {/* Aktive Warnungen vorhanden */}
            <PiBellSimpleSlash size={20} /> {/* Warnungsoverlay aktiv */}
          </button>
        </div>
      </Tooltip>
    </QueryClientProvider>
  );
}
