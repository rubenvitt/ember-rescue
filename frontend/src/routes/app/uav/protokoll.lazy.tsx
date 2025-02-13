import { FlightProtocolDto, PostFlightChecksDto, PreFlightChecksDto, UAVMissionDto, UAVTemplateDto } from '@bluelight-hub/shared/client/index.js';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import { DrohnenEinsatzComponent } from '../../../components/atomic/organisms/DrohnenEinsatz.component.js';
import { useEinsatz } from '../../../hooks/einsatz.hook.js';
import { useUAV } from '../../../hooks/uav/uav.hook.js';
import { CreateFlugDto, CreatePostFlightDto, CreatePreFlightDto, DrohnenEinsatzStatus, FlugStatus } from '../../../types/app/flugprotokoll.types.js';

export const Route = createLazyFileRoute('/app/uav/protokoll')({
    component: UAVProtokoll,
});

function UAVProtokoll() {
    const { missionId } = useEinsatz();
    const { uavMissions, templateUAVs, submitPreFlightChecks, addFlightProtocol, submitPostFlightChecks, addUAVToEinsatz } = useUAV();

    const handlePreFlightSubmit = useCallback((formData: CreatePreFlightDto, uavIndex: number) => {
        const preFlightChecksDto: PreFlightChecksDto = {
            pilot: formData.data.pilot,
            copilot: formData.data.copilot,
            einsatzleiter: formData.data.einsatzleiter,
            wetterbedingungen: formData.data.wetterbedingungen,
            checkliste: formData.data.checkliste
        };
        submitPreFlightChecks.mutate({ data: preFlightChecksDto, uavIndex });
    }, [submitPreFlightChecks]);

    const handleFlugSubmit = useCallback((formData: CreateFlugDto, uavIndex: number) => {
        const flightProtocolDto: FlightProtocolDto = {
            pilot: formData.data.pilot,
            copilot: formData.data.copilot,
            missionsziel: formData.data.missionsziel,
            takeoff: formData.data.takeoff.toDate(),
            landing: formData.data.landing?.toDate(),
            status: formData.data.status,
            flugdauer: formData.data.flugdauer,
            maxFlughoehe: formData.data.flughoehe,
            besondereVorkommnisse: formData.data.besonderheiten ? [formData.data.besonderheiten] : undefined
        };
        addFlightProtocol.mutate({ data: flightProtocolDto, uavIndex });
    }, [addFlightProtocol]);

    const handlePostFlightSubmit = useCallback((formData: CreatePostFlightDto, uavIndex: number) => {
        const postFlightChecksDto: PostFlightChecksDto = {
            landezeitpunkt: formData.data.landezeitpunkt.toDate(),
            akkuStand: formData.data.akkuStand,
            schaeden: formData.data.schaeden,
            schadensBeschreibung: formData.data.schadensBeschreibung,
            einsatzleiterAbnahme: formData.data.einsatzleiterAbnahme,
            anmerkungen: formData.data.anmerkungen
        };
        submitPostFlightChecks.mutate({ data: postFlightChecksDto, uavIndex });
    }, [submitPostFlightChecks]);

    const handleFlugBeenden = useCallback((flugId: string) => {
        // TODO: Implement flight end logic
        console.log('Flug beendet:', flugId);
    }, []);

    const handleAddUAV = useCallback((uavId: string) => {
        if (!missionId) return;

        addUAVToEinsatz.mutate({
            uavId,
            einsatzId: missionId
        });
    }, [addUAVToEinsatz, missionId]);

    if (uavMissions.isLoading || templateUAVs.isLoading) {
        return <div className="p-6">Lade Daten...</div>;
    }

    if (!templateUAVs.data?.data) {
        return <div className="p-6">Keine UAV-Vorlagen verfügbar.</div>;
    }

    // Transform data for component
    const einsaetze = uavMissions.data?.data?.missions?.map((mission: UAVMissionDto, index: number) => {
        const uav = mission.uav as UAVTemplateDto;
        return {
            id: index.toString(),
            bezeichnung: `${uav.modell} - ${uav.seriennummer}`,
            status: mission.status as DrohnenEinsatzStatus,
            beginn: new Date(), // TODO: Add beginn to UAVMissionDto
            drohnenId: index.toString(),
            preFlightData: mission.preFlightChecks,
            flugIds: mission.flightProtocols.map((_: FlightProtocolDto, flugIndex: number) => `${index}-${flugIndex}`)
        };
    }) ?? [];

    const fluege = uavMissions.data?.data?.missions?.flatMap((mission: UAVMissionDto, missionIndex: number) => {
        return mission.flightProtocols.map((protocol: FlightProtocolDto, flugIndex: number) => ({
            id: `${missionIndex}-${flugIndex}`,
            einsatzId: missionIndex.toString(),
            status: protocol.status as FlugStatus,
            pilot: protocol.pilot,
            copilot: protocol.copilot,
            takeoff: dayjs(protocol.takeoff),
            landing: protocol.landing ? dayjs(protocol.landing) : undefined,
            missionsziel: protocol.missionsziel,
            flughoehe: protocol.maxFlughoehe,
            besondereVorkommnisse: protocol.besondereVorkommnisse
        }));
    }) ?? [];

    const verfuegbareDrohnen = templateUAVs.data.data.map((uav: UAVTemplateDto) => ({
        id: uav.id ?? '',
        modell: uav.modell
    }));

    // TODO: Get these from a user/personnel service
    const mockPersonalData = {
        verfuegbarePiloten: [
            { id: '1', name: 'Max Mustermann' },
            { id: '2', name: 'Erika Musterfrau' },
        ],
        einsatzleiter: [
            { id: '1', name: 'Karl Koordinator' },
            { id: '2', name: 'Lisa Leitung' },
        ],
    };

    return (
        <div className="p-6">
            <DrohnenEinsatzComponent
                einsaetze={einsaetze}
                fluege={fluege}
                verfuegbarePiloten={mockPersonalData.verfuegbarePiloten}
                einsatzleiter={mockPersonalData.einsatzleiter}
                verfuegbareDrohnen={verfuegbareDrohnen}
                onPreFlightSubmit={handlePreFlightSubmit}
                onFlugSubmit={handleFlugSubmit}
                onPostFlightSubmit={handlePostFlightSubmit}
                onFlugBeenden={handleFlugBeenden}
            />
        </div>
    );
} 