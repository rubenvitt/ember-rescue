import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { DrohnenEinsatzComponent } from '../../../components/atomic/organisms/DrohnenEinsatz.component.js';
import { DrohnenEinsatz, DrohnenEinsatzStatus, FlugData, FlugStatus, PreFlightData } from '../../../types/app/flugprotokoll.types.js';

export const Route = createLazyFileRoute('/app/uav/protokoll')({
    component: UAVProtokoll,
});

function UAVProtokoll() {
    // TODO: Diese Daten sollten aus einem Backend kommen
    const mockData = {
        einsaetze: [
            {
                id: '1',
                bezeichnung: 'Testflug DJI Mini 3',
                status: 'PREFLIGHT_CHECKS' satisfies DrohnenEinsatzStatus,
                beginn: new Date(),
                drohnenId: '1',
                flugIds: [],
            },
            {
                id: '2',
                bezeichnung: 'Testflug Mavic 3',
                status: 'ACTIVE' satisfies DrohnenEinsatzStatus,
                beginn: new Date(),
                drohnenId: '2',
                preFlightData: {
                    id: '1',
                    einsatzId: '2',
                    timestamp: dayjs(),
                    drohnenmodell: 'DJI Mavic 3',
                    seriennummer: '1234567890',
                    konfiguration: 'Standard',
                    nutzlast: '100g',
                    firmware: '1.0.0',
                    standort: 'Testgelände',
                    wetterbedingungen: "Sonnig, 20°C, 5 km/h, 0°, 1000 m",
                    gelaendebeschreibung: 'Gelände mit Bäumen und Stromleitungen',
                    luftraumklasse: 'Luftraumklasse 1',
                    flugverbotszonen: 'Flugverbotszonen 1',
                    checklistenAbgearbeitet: true,
                    risikobeurteilung: 'Gering',
                    notfallprozeduren: 'Notfallprozeduren 1',
                    flugerlaubnis: 'Flugerlaubnis 1',
                    luftraumfreigabe: 'Luftraumfreigabe 1',
                    bemerkungen: 'Bemerkungen 1',
                },
                flugIds: ['1', '2'],
            },
        ] satisfies DrohnenEinsatz[],
        fluege: [
            {
                id: '1',
                einsatzId: '2',
                status: 'COMPLETED' satisfies FlugStatus,
                pilot: '1',
                copilot: '2',
                takeoff: dayjs(new Date(Date.now() - 3600000)),
                landing: dayjs(new Date(Date.now() - 3500000)),
                missionsziel: 'Testflug',
                batteriestandStart: 100,
                preFlightId: '1',
                flughoehe: 50,
                anzahlStarts: 1,
                temperatur: 20,
                windgeschwindigkeit: 5,
                windrichtung: 'N',
                sicht: 'SEHR_GUT',
            },
            {
                id: '2',
                einsatzId: '2',
                status: 'INFLIGHT' satisfies FlugStatus,
                pilot: '1',
                takeoff: dayjs(new Date(Date.now() - 3600000)),
                landing: dayjs(new Date(Date.now() - 3500000)),
                missionsziel: 'Testflug',
                batteriestandStart: 100,
                preFlightId: '1',
                flughoehe: 50,
                anzahlStarts: 1,
                temperatur: 20,
                windgeschwindigkeit: 5,
                windrichtung: 'N',
                sicht: 'SEHR_GUT',
            },
        ] satisfies FlugData[],
        verfuegbarePiloten: [
            { id: '1', name: 'Max Mustermann' },
            { id: '2', name: 'Erika Musterfrau' },
        ],
        einsatzleiter: [
            { id: '1', name: 'Karl Koordinator' },
            { id: '2', name: 'Lisa Leitung' },
        ],
        verfuegbareDrohnen: [
            { id: '1', modell: 'DJI Mini 3 Pro' },
            { id: '2', modell: 'DJI Mavic 3' },
        ],
    };

    const handlePreFlightSubmit = useCallback((data: PreFlightData) => {
        console.log('Pre-Flight submitted:', data);
    }, []);

    const handleFlugSubmit = useCallback((data: FlugData) => {
        console.log('Flug submitted:', data);
    }, []);

    const handlePostFlightSubmit = useCallback((data: any) => {
        console.log('Post-Flight submitted:', data);
    }, []);

    const handleFlugBeenden = useCallback((flugId: string) => {
        console.log('Flug beendet:', flugId);
    }, []);

    return (
        <div className="p-6">
            <DrohnenEinsatzComponent
                einsaetze={mockData.einsaetze}
                fluege={mockData.fluege}
                verfuegbarePiloten={mockData.verfuegbarePiloten}
                einsatzleiter={mockData.einsatzleiter}
                verfuegbareDrohnen={mockData.verfuegbareDrohnen}
                onPreFlightSubmit={handlePreFlightSubmit}
                onFlugSubmit={handleFlugSubmit}
                onPostFlightSubmit={handlePostFlightSubmit}
                onFlugBeenden={handleFlugBeenden}
            />
        </div>
    );
} 