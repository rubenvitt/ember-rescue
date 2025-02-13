import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UAVTemplateDto } from '@templates/uav/uav.dto';
import { ApiResponse } from '../../types';

export class WetterbedingungsDto {
    @ApiProperty()
    temperatur: number;

    @ApiProperty()
    windgeschwindigkeit: number;

    @ApiProperty()
    niederschlag: boolean;

    @ApiProperty()
    sicht: number;
}

export class ChecklisteDto {
    @ApiProperty()
    akkuGeladen: boolean;

    @ApiProperty()
    kameraCheck: boolean;

    @ApiProperty()
    propellerCheck: boolean;

    @ApiProperty()
    fernsteuerungCheck: boolean;

    @ApiProperty()
    kompassKalibriert: boolean;

    @ApiProperty()
    gpsVerfuegbar: boolean;

    @ApiProperty()
    notlandungspunkte: boolean;
}

export class PreFlightChecksDto {
    @ApiProperty()
    drohnenmodell: string;

    @ApiProperty()
    pilot: string;

    @ApiPropertyOptional()
    copilot?: string;

    @ApiProperty()
    einsatzleiter: string;

    @ApiProperty({ type: WetterbedingungsDto })
    wetterbedingungen: WetterbedingungsDto;

    @ApiProperty({ type: ChecklisteDto })
    checkliste: ChecklisteDto;
}

export class FlightProtocolDto {
    @ApiProperty()
    index: number;

    @ApiProperty()
    pilot: string;

    @ApiPropertyOptional()
    copilot?: string;

    @ApiProperty()
    missionsziel: string;

    @ApiProperty()
    takeoff: Date;

    @ApiPropertyOptional()
    landing?: Date;

    @ApiProperty({ enum: ['PLANNED', 'TAKEOFF', 'INFLIGHT', 'LANDED', 'COMPLETED'] })
    status: 'PLANNED' | 'TAKEOFF' | 'INFLIGHT' | 'LANDED' | 'COMPLETED';

    @ApiPropertyOptional()
    flugdauer?: number;

    @ApiPropertyOptional()
    maxFlughoehe?: number;

    @ApiPropertyOptional({ type: [String] })
    besondereVorkommnisse?: string[];
}

export class PostFlightChecksDto {
    @ApiProperty()
    landezeitpunkt: Date;

    @ApiProperty()
    akkuStand: number;

    @ApiProperty()
    schaeden: boolean;

    @ApiPropertyOptional()
    schadensBeschreibung?: string;

    @ApiProperty()
    einsatzleiterAbnahme: string;

    @ApiPropertyOptional()
    anmerkungen?: string;
}

export class UAVMissionDto {
    @ApiProperty()
    index: number;

    @ApiProperty({ type: UAVTemplateDto })
    uav: UAVTemplateDto;

    @ApiPropertyOptional({ type: PreFlightChecksDto })
    preFlightChecks?: PreFlightChecksDto;

    @ApiProperty({ type: [FlightProtocolDto] })
    flightProtocols: FlightProtocolDto[];

    @ApiPropertyOptional({ type: PostFlightChecksDto })
    postFlightChecks?: PostFlightChecksDto;

    @ApiProperty({ enum: ['PREFLIGHT_CHECKS', 'ACTIVE', 'POSTFLIGHT_CHECKS', 'COMPLETED'] })
    status: 'PREFLIGHT_CHECKS' | 'ACTIVE' | 'POSTFLIGHT_CHECKS' | 'COMPLETED';
}

export class CreateUAVMissionDto {
    @ApiProperty()
    uavId: string;

    @ApiProperty()
    einsatzId: string;
}

export class UAVMissionsDto {
    @ApiProperty({ type: UAVMissionDto, isArray: true })
    missions: UAVMissionDto[];
}

export class UAVMissionResponse extends ApiResponse<UAVMissionDto> {
    @ApiProperty({
        type: UAVMissionDto,
        required: true,
    })
    data: UAVMissionDto;
}

export class UAVMissionsResponse extends ApiResponse<UAVMissionsDto> {
    @ApiProperty({
        type: UAVMissionsDto,
        required: true,
    })
    data: UAVMissionsDto;
}

export class FlightProtocolResponse extends ApiResponse<FlightProtocolDto> {
    @ApiProperty({
        type: FlightProtocolDto,
        required: true,
    })
    data: FlightProtocolDto;
} 