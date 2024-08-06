import { MapProvider } from 'react-map-gl';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useTheme } from '../../../hooks/theme.hook.js';
import mapboxgl from 'mapbox-gl';
import { erzeugeTaktischesZeichen } from 'taktische-zeichen-core';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { useEinheiten } from '../../../hooks/einheiten/einheiten.hook.js';
import ZoomControl from '@mapbox-controls/zoom';
import '@mapbox-controls/styles/src/index.css';
import StylesControl from '@mapbox-controls/styles';
import { formatMGRS, mgrs } from '../../../utils/coordinates.js';
import { RescueControl } from './mapbox/Controls.js';
import { Button } from '../molecules/Button.component.tsx';

interface Props {
  mapboxToken: string;
}

function _MapboxComponent({ mapboxToken }: Props) {
  const { isDark } = useTheme();
  const initialMapStyle = useMemo<string>(() => {
    return isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/standard';
  }, []);
  const [map, setMap] = useState<mapboxgl.Map | null>();
  const mapDiv = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log('recreate map', mapDiv);
    if (!mapboxToken) return;
    console.log('mapboxToken', mapboxToken);
    const map = new mapboxgl.Map({
      container: 'map',
      style: initialMapStyle,
      center: [10.55, 52.96],
      zoom: 11,
      accessToken: mapboxToken,
    });

    const draw = new MapboxDraw({
      controls: {
        combine_features: false,
        uncombine_features: false,
        line_string: true,
        point: true,
        polygon: true,
        trash: true,
      },
    });
    const zoomControl = new ZoomControl();

    const mapboxGeocoder = new MapboxGeocoder({
      accessToken: mapboxToken,
      // @ts-ignore
      mapboxgl: mapboxgl,
      countries: 'de',
      collapsed: true,
    });
    const stylesControl = new StylesControl({
      styles: [
        { styleName: 'Standard', styleUrl: 'mapbox://styles/mapbox/standard', label: 'Standard' },
        { styleName: 'Straßen', styleUrl: 'mapbox://styles/mapbox/streets-v12', label: 'Straßen' },
        { styleName: 'Dark', styleUrl: 'mapbox://styles/mapbox/dark-v11', label: 'Dark' },
        { styleName: 'Satellit', styleUrl: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'Satellit' },
      ],
      compact: true,
    });

    // @ts-ignore
    map.addControl(mapboxGeocoder, 'top-left');
    // @ts-ignore
    map.addControl(draw, 'top-left');
    // @ts-ignore
    map.addControl(zoomControl, 'bottom-right');
    // @ts-ignore
    map.addControl(stylesControl, 'bottom-left');

    map.addControl(new RescueControl());

    map.on('load', () => {
      // application code
    });

    map.on('moveend', () => {
      // on move end
    });

    // @ts-ignore
    map.on('draw.update', () => {
      const data = draw.getAll();
      const roundedArea = Math.round(turf.area(data) * 100) / 100;
      console.log('selected area', roundedArea + 'm^2');
    });
    // @ts-ignore
    map.on('draw.create', () => {
      const data = draw.getAll();
      const roundedArea = Math.round(turf.area(data) * 100) / 100;
      console.log('selected area', roundedArea + 'm^2');
    });

    setMap(map);
  }, [mapDiv, mapboxToken]);

  const { einheitenImEinsatz } = useEinheiten();

  return <>
    <div className="border border-gray-500 mb-2 px-6 py-2 dark:text-white">
      Einheiten der Karte hinzufügen (DEBUG)
      <div className="flex gap-2 overflow-scroll flex-nowrap">
        {einheitenImEinsatz.data?.map(einheit => (
          <Button
            key={einheit.id}
            intent="outline"
            className="break-keep"
            onClick={() => {
              let presentMarker = map?._markers?.find((m) => m.getElement().id === `einheit-${einheit.funkrufname}`);
              if (presentMarker) {
                alert('found item');
                map?.setCenter(presentMarker.getLngLat());
              } else {
                let element = document.createElement('div');
                let svg = erzeugeTaktischesZeichen({
                  grundzeichen: 'fahrzeug',
                  organisation: 'hilfsorganisation',
                  einheit: 'zug',
                  fachaufgabe: 'iuk',
                  name: einheit.funkrufname,
                }).svg;
                element.innerHTML = svg.render();
                element.className = 'w-20 h-20';
                element.id = `einheit-${einheit.funkrufname}`;
                map && new mapboxgl.Marker({ element, draggable: true })
                  .setPopup(new mapboxgl.Popup().setText(`Führungskraftwagen 40-12-1 | ${formatMGRS(mgrs(map.getCenter())!)}`))
                  .setLngLat(map.getCenter())
                  .addTo(map);
              }
            }}>{einheit.funkrufname}</Button>
        ))}

      </div>
    </div>
    <div ref={mapDiv} id="map" className="h-full w-full"></div>
    {/*<Map*/}
    {/*  id={'map'}*/}
    {/*  onLoad={onMapLoaded}*/}
    {/*  attributionControl={false}*/}
    {/*  // @ts-ignore*/}
    {/*  mapLib={import('mapbox-gl')}*/}
    {/*  initialViewState={{*/}
    {/*    longitude: -100,*/}
    {/*    latitude: 40,*/}
    {/*    zoom: 3.5,*/}
    {/*  }}*/}
    {/*  mapStyle={dark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/standard'}*/}
    {/*  language={'de'}*/}
    {/*  logoPosition={'bottom-right'}*/}
    {/*  maxZoom={24}*/}
    {/*  testMode={true}*/}
    {/*  mapboxAccessToken={secret.data.value}>*/}
    {/*  <ScaleControl />*/}
    {/*  <GeocoderControl mapboxAccessToken={secret.data.value} position="top-left" countries="de" />*/}
    {/*  <AttributionControl position="bottom-right" customAttribution="Project Rescue" compact />*/}
    {/*  /!*{mapLoaded && dark && <Layer id="darkModeLayer" type="background" paint={{*!/*/}
    {/*  /!*  'background-color': 'hsl(0,0,0)',*!/*/}
    {/*  /!*  'background-opacity': 0.2,*!/*/}
    {/*  /!*}} />}*!/*/}


    {/*  <Marker longitude={-100} latitude={40} draggable>*/}
    {/*    /!* @ts-ignore *!/*/}
    {/*    <TaktischesZeichen*/}
    {/*      className="h-24 w-24"*/}
    {/*      grundzeichen="fahrzeug"*/}
    {/*      organisation="hilfsorganisation"*/}
    {/*      organisationName="DRK"*/}
    {/*    />*/}
    {/*  </Marker>*/}

    {/*  <Popup*/}
    {/*    anchor="top"*/}
    {/*    longitude={52}*/}
    {/*    latitude={11}*/}
    {/*  >*/}
    {/*    <div>*/}
    {/*      Teststadt, ist hier |{' '}*/}
    {/*      <a*/}
    {/*        target="_new"*/}
    {/*        href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=salzgitter, niedersachsen`}*/}
    {/*      >*/}
    {/*        Wikipedia*/}
    {/*      </a>*/}
    {/*    </div>*/}
    {/*  </Popup>*/}
    {/*</Map>*/}
  </>;
}

export const MapboxComponent = ({ mapboxToken }: Props) => <MapProvider>
  <_MapboxComponent mapboxToken={mapboxToken} />
</MapProvider>;