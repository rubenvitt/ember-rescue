import { AttributionControl, Map, MapProvider, Marker, Popup, ScaleControl, useMap } from 'react-map-gl';
import { useSecret } from '../../../hooks/secrets.hook.js';
import { useCallback, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from '../../../hooks/theme.hook.js';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import GeocoderControl from '../molecules/MapControls.component.js';
import TaktischesZeichen from 'taktische-zeichen-react';
import { erzeugeTaktischesZeichen } from 'taktische-zeichen-core';

function _MapboxComponent() {
  const { map } = useMap();
  const { secret } = useSecret({ secretKey: 'mapboxApi' });
  const { dark } = useTheme();
  const [mapLoaded, setMapLoaded] = useState<boolean>();
  const onMapLoaded = useCallback(() => {
    if (!map) {
      console.error('Map is missing (should not happen, because map was loaded 🤔)');
      return;
    }
    setMapLoaded(true);
    map.zoomTo(5);
    setTimeout(() => {
      map.zoomTo(10);
    }, 2000);

    erzeugeTaktischesZeichen({
      grundzeichen: 'fahrzeug',
      organisation: 'hilfsorganisation',
      organisationName: 'DRK',
    });

    // @ts-ignore
    map.addControl(new MapboxGeocoder({ mapboxgl, accessToken: secret.data!! }));
  }, [map]);

  if (!secret.data?.value) return null;
  return <Map
    id={'map'}
    onLoad={onMapLoaded}
    attributionControl={false}
    // @ts-ignore
    mapLib={import('mapbox-gl')}
    initialViewState={{
      longitude: -100,
      latitude: 40,
      zoom: 3.5,
    }}
    mapStyle={dark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/standard'}
    language={'de'}
    logoPosition={'bottom-right'}
    maxZoom={24}
    testMode={true}
    mapboxAccessToken={secret.data.value}>
    <ScaleControl />
    <GeocoderControl mapboxAccessToken={secret.data.value} position="top-left" />
    <AttributionControl position="bottom-right" customAttribution="Project Rescue" compact />
    {/*{mapLoaded && dark && <Layer id="darkModeLayer" type="background" paint={{*/}
    {/*  'background-color': 'hsl(0,0,0)',*/}
    {/*  'background-opacity': 0.2,*/}
    {/*}} />}*/}


    <Marker longitude={-100} latitude={40} draggable>
      {/* @ts-ignore */}
      <TaktischesZeichen
        className="h-24 w-24"
        grundzeichen="fahrzeug"
        organisation="hilfsorganisation"
        organisationName="DRK"
      />
    </Marker>

    <Popup
      anchor="top"
      longitude={52}
      latitude={11}
    >
      <div>
        Teststadt, ist hier |{' '}
        <a
          target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=salzgitter, niedersachsen`}
        >
          Wikipedia
        </a>
      </div>
    </Popup>
  </Map>;
}

export const MapboxComponent = () => <MapProvider>
  <_MapboxComponent />
</MapProvider>;