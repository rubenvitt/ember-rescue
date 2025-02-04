import { Dayjs } from 'dayjs';

export type EinsatzStatus = 'VORBEREITUNG' | 'AKTIV' | 'ABGESCHLOSSEN';
export type DrohnenEinsatzStatus = 'PREFLIGHT_CHECKS' | 'ACTIVE' | 'POSTFLIGHT_CHECKS' | 'COMPLETED';
export type FlugStatus = 'PLANNED' | 'TAKEOFF' | 'INFLIGHT' | 'LANDED' | 'COMPLETED';

export interface PreFlightData {
    id: string;
    einsatzId: string;
    timestamp: Dayjs;

    // Drohne und Ausrüstung
    drohnenmodell: string;
    seriennummer: string;
    konfiguration: string;
    nutzlast: string;
    firmware: string;

    // Einsatzgebiet
    standort: string;
    gelaendebeschreibung: string;
    luftraumklasse: string;
    flugverbotszonen: string;

    // Vorflugkontrolle
    checklistenAbgearbeitet: boolean;
    risikobeurteilung: string;
    wetterbedingungen: string;
    notfallprozeduren: string;

    // Genehmigungen & Dokumentation
    flugerlaubnis?: string;
    luftraumfreigabe?: string;
    bemerkungen?: string;
}

export interface FlugData {
    id: string;
    einsatzId: string;
    preFlightId: string;  // Referenz zur Pre-Flight-Instanz

    // Personal
    pilot: string;
    copilot?: string;

    // Flugzeiten
    takeoff: Dayjs;
    landing?: Dayjs;
    flightTime?: number; // in Minuten

    // Flugdetails
    missionsziel: string;
    flughoehe: number;
    anzahlStarts: number;

    // Wetterbedingungen beim Start
    temperatur: number;
    windgeschwindigkeit: number;
    windrichtung: string;
    sicht: 'SEHR_GUT' | 'GUT' | 'MAESSIG' | 'SCHLECHT';

    // Status und Ereignisse
    status: FlugStatus;
    besonderheiten?: string;
    technischeProbleme?: string;

    // Telemetrie-Daten
    batteriestandStart: number;
    batteriestandLandung?: number;
    maximalentfernung?: number;
    maximalhoehe?: number;
}

export interface PostFlightData {
    id: string;
    einsatzId: string;
    timestamp: Dayjs;

    // Technische Überprüfung
    schaeden: boolean;
    schadensBeschreibung?: string;
    wartungNotwendig: boolean;
    wartungshinweise?: string;

    // Einsatzauswertung
    einsatzzielErreicht: boolean;
    auswertung: string;
    verbesserungsvorschlaege?: string;

    // Dokumentation
    bildmaterialVorhanden: boolean;
    bildmaterialBeschreibung?: string;

    // Abschluss
    einsatzleiterFreigabe: boolean;
    freigegebenVon?: string;
    abschlussBemerkungen?: string;
}

export interface DrohnenEinsatz {
    id: string;
    bezeichnung: string;
    status: DrohnenEinsatzStatus;
    beginn: Date;
    ende?: Date;
    drohnenId: string;
    preFlightData?: PreFlightData;
    postFlightData?: PostFlightData;
    flugIds: string[];
}

export interface CreatePreFlightDto {
    data: Omit<PreFlightData, 'id' | 'timestamp'>;
}

export interface CreateFlugDto {
    data: Omit<FlugData, 'id' | 'flightTime' | 'status'>;
}

export interface CreatePostFlightDto {
    data: Omit<PostFlightData, 'id' | 'timestamp'>;
} 