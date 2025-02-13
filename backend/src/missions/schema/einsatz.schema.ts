import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Alarmstichwort,
  AlarmstichwortDto,
} from '@templates/alarmstichworte/alarmstichwort.schema';
import { QualifikationTemplate } from '@templates/qualifications/qualifikation.schema';
import { EmbeddedStatus, Status } from '@templates/status/status.schema';
import { EmbeddedVehiclesTemplate } from '@templates/vehicles/vehicles-template.schema';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { BearbeiterDto, BearbeiterWithStatusDto } from '../../user/bearbeiter/core/bearbeiter.dto';
import { JournalEntryType } from '../journal/journal.dto';
import { Notiz } from '../notes/notiz.schema';
import { Reminder } from '../reminders/reminder.schema';
import { UAVMission } from './uav-mission.schema';

@Schema({ timestamps: true })
class StatusHistoryEntry {
  @Prop({ required: true, index: true })
  timestamp: Date;

  @Prop({ required: true })
  status: Status;
}

@Schema({ timestamps: true })
class Personal {
  @Prop()
  name: string;

  @Prop()
  qualifikation: QualifikationTemplate;

  @Prop()
  telefonnummer: string;

  @Prop({ default: false })
  isFuehrungskraft: boolean;
}

@Schema({ timestamps: true, _id: false })
export class FahrzeugOnEinsatz extends EmbeddedVehiclesTemplate {
  @Prop({ required: true })
  einsatzbeginn: Date;

  @Prop({})
  einsatzende: Date;

  @Prop({ required: true, default: [] })
  personal: Personal[];

  @Prop({ required: true })
  kapazitaet: number;

  @Prop({ required: true, default: [] })
  status_history: StatusHistoryEntry[];

  @Prop()
  currentStatus?: EmbeddedStatus;
}

/**
 * @deprecated
 */
export type FahrzeugOnEinsatzDto = {
  fullOpta: string;
  einsatzbeginn: Date;
  einsatzende?: Date;
  personal: {
    name: string;
    qualifikation: QualifikationTemplate;
    telefonnummer: string;
    isFuehrungskraft: boolean;
  }[];
  kapazitaet: number;
  status_history: {
    timestamp: Date;
    status: Status;
  }[];
};

@Schema()
class EinsatzMetadaten {
  @Prop({ required: true })
  ort: string;
}

@Schema({
  timestamps: true,
})
class EinsatztagebuchEintrag {
  @Prop({ required: true })
  timestamp: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  sender: string;
  @Prop({ required: true })
  receiver: string;
  @Prop({ required: true, default: false })
  archived: boolean;
  @Prop({ required: true })
  nummer: number;
  @Prop({ required: true })
  type: JournalEntryType;
  @Prop({ required: true })
  bearbeiter: string;
}

const EinsatztagebuchEintragSchema = SchemaFactory.createForClass(
  EinsatztagebuchEintrag,
);

@Schema()
class Einsatztagebuch {
  @Prop({
    required: true,
    default: [],
    type: [{ type: EinsatztagebuchEintragSchema }],
  })
  items: EinsatztagebuchEintrag[];

  @Prop({ default: 0 })
  counter: number;
}

export type CreateEinsatzDto = {
  beginn?: Date;
  bearbeiter: BearbeiterDto;
  aufnehmendesRettungsmittel: string;
  einsatzAlarmstichwort: AlarmstichwortDto;
  einsatzMeta: EinsatzMetadaten;
};

@Schema({ timestamps: true, collection: 'einsaetze' })
export class Einsatz extends Document {
  @Prop({})
  backendVersion: string;
  @Prop({ required: true })
  beginn: Date;
  @Prop()
  ende: Date;
  @Prop()
  abgeschlossen: Date;
  @Prop({ type: Number, unique: true })
  einsatznummer: number;

  @Prop({ required: true })
  bearbeiter: BearbeiterWithStatusDto;

  @Prop({ required: true })
  aufnehmendesRettungsmittel: string;

  @Prop({ required: true, default: { items: [] } })
  einsatzTagebuch: Einsatztagebuch;

  @Prop({ required: true })
  einsatzAlarmstichwort: Alarmstichwort;

  @Prop({ required: true, type: [{ type: FahrzeugOnEinsatz }], default: [] })
  fahrzeuge: FahrzeugOnEinsatz[];

  @Prop({ required: true, type: [UAVMission], default: [] })
  uavMissions: UAVMission[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notiz' }],
    default: [],
  })
  notizen: Notiz[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' }],
    default: [],
  })
  reminders: Reminder[];

  @Prop({ required: true })
  einsatzMeta: EinsatzMetadaten;
}

export const EinsatzSchema = SchemaFactory.createForClass(Einsatz);
