import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EmbeddedUAVTemplate } from '@templates/uav/uav-template.schema';

@Schema({ _id: false })
class Wetterbedingungen {
    @Prop({ required: true, type: Number })
    temperatur: number;

    @Prop({ required: true, type: Number })
    windgeschwindigkeit: number;

    @Prop({ required: true, type: Boolean })
    niederschlag: boolean;

    @Prop({ required: true, type: Number })
    sicht: number;
}

@Schema({ _id: false })
class Checkliste {
    @Prop({ required: true, type: Boolean })
    akkuGeladen: boolean;

    @Prop({ required: true, type: Boolean })
    kameraCheck: boolean;

    @Prop({ required: true, type: Boolean })
    propellerCheck: boolean;

    @Prop({ required: true, type: Boolean })
    fernsteuerungCheck: boolean;

    @Prop({ required: true, type: Boolean })
    kompassKalibriert: boolean;

    @Prop({ required: true, type: Boolean })
    gpsVerfuegbar: boolean;

    @Prop({ required: true, type: Boolean })
    notlandungspunkte: boolean;
}

@Schema({ _id: false })
class PreFlightChecks {
    @Prop({ required: true })
    drohnenmodell: string;

    @Prop({ required: true })
    pilot: string;

    @Prop()
    copilot?: string;

    @Prop({ required: true })
    einsatzleiter: string;

    @Prop({ required: true, type: Wetterbedingungen })
    wetterbedingungen: Wetterbedingungen;

    @Prop({ required: true, type: Checkliste })
    checkliste: Checkliste;
}

@Schema({ _id: false })
class FlightProtocol {
    @Prop({ required: true })
    index: number;

    @Prop({ required: true })
    pilot: string;

    @Prop()
    copilot?: string;

    @Prop({ required: true })
    missionsziel: string;

    @Prop({ required: true })
    takeoff: Date;

    @Prop()
    landing?: Date;

    @Prop({ required: true, default: 'PLANNED' })
    status: 'PLANNED' | 'TAKEOFF' | 'INFLIGHT' | 'LANDED' | 'COMPLETED';

    @Prop({ type: Number })
    flugdauer?: number;

    @Prop({ type: Number })
    maxFlughoehe?: number;

    @Prop({ type: [String] })
    besondereVorkommnisse?: string[];
}

@Schema({ timestamps: true })
class PostFlightChecks {
    @Prop({ required: true })
    landezeitpunkt: Date;

    @Prop({ required: true, type: Number })
    akkuStand: number;

    @Prop({ required: true, type: Boolean })
    schaeden: boolean;

    @Prop()
    schadensBeschreibung?: string;

    @Prop({ required: true })
    einsatzleiterAbnahme: string;

    @Prop()
    anmerkungen?: string;
}

@Schema({ timestamps: true })
export class UAVMission {
    @Prop({ required: true })
    index: number;

    @Prop({ required: true, type: EmbeddedUAVTemplate })
    uav: EmbeddedUAVTemplate;

    @Prop({ type: PreFlightChecks })
    preFlightChecks?: PreFlightChecks;

    @Prop({ type: [FlightProtocol], default: [] })
    flightProtocols: FlightProtocol[];

    @Prop({ type: PostFlightChecks })
    postFlightChecks?: PostFlightChecks;

    @Prop({ required: true, default: 'PREFLIGHT_CHECKS' })
    status: 'PREFLIGHT_CHECKS' | 'ACTIVE' | 'POSTFLIGHT_CHECKS' | 'COMPLETED';
}

export const UAVMissionSchema = SchemaFactory.createForClass(UAVMission); 