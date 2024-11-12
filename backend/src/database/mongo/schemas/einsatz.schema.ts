import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BearbeiterDto } from './bearbeiter.schema';
import { EinsatztagebuchEintragType } from '../../../types';
import { Alarmstichwort } from './alarmstichwort.schema';
import { Notiz } from './einsatz/notiz.schema';
import { Reminder } from './einsatz/reminder.schema';
import { Status } from './status.schema';
import { Qualifikation } from './qualifikation.schema';
import { Opta } from './opta.schema';

@Schema({ timestamps: true })
class StatusHistoryEntry {
  @Prop({ required: true, index: true })
  timestamp: Date;

  @Prop({ required: true })
  status: Status;
}

@Schema()
class FahrzeugIconDefinition {
  @Prop()
  organisation: string;
  @Prop()
  fachaufgabe: string;
  @Prop()
  verwaltungsstufe: string;
}

@Schema({ timestamps: true })
class Fahrzeug {
  @Prop({ type: Opta })
  opta: Opta | string;

  @Prop()
  iconDefinition: FahrzeugIconDefinition;
}

@Schema({ timestamps: true })
class Personal {
  @Prop()
  name: string;

  @Prop()
  qualifikation: Qualifikation;

  @Prop()
  telefonnummer: string;

  @Prop({ default: false })
  isFuehrungskraft: boolean;
}

@Schema({ timestamps: true })
class FahrzeugOnEinsatz extends Fahrzeug {
  @Prop({ required: true })
  einsatzbeginn: Date;

  @Prop({})
  einsatzende: Date;

  @Prop({ required: true, default: [] })
  personal: Personal[];

  @Prop({ required: true })
  kapazitaet: number;

  @Prop()
  status_history: StatusHistoryEntry[];
}

@Schema()
class EinsatzMetadaten {
  //
}

@Schema()
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
  type: EinsatztagebuchEintragType;
  @Prop({ required: true })
  bearbeiter: string;
}

@Schema()
class Einsatztagebuch {
  @Prop({
    required: true,
    default: [],
    type: [{ type: EinsatztagebuchEintrag }],
  })
  items: EinsatztagebuchEintrag;
}

@Schema({ timestamps: true, collection: 'einsaetze' })
export class Einsatz extends Document {
  @Prop({ required: true })
  beginn: Date;
  @Prop()
  ende: Date;
  @Prop()
  abgeschlossen: Date;
  @Prop({ type: Number, unique: true, required: true })
  einsatznummer: number;

  @Prop({ required: true })
  bearbeiter: BearbeiterDto;

  @Prop({ required: true, type: Fahrzeug })
  aufnehmendesRettungsmittel: Fahrzeug; // FIXME with new model

  @Prop({ required: true, default: { items: [] } })
  einsatzTagebuch: Einsatztagebuch;

  @Prop({ required: true })
  einsatzAlarmstichwort: Alarmstichwort;

  @Prop({ required: true, type: [{ type: FahrzeugOnEinsatz }] })
  fahrzeuge: FahrzeugOnEinsatz[];

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

let schema = SchemaFactory.createForClass(Einsatz);
schema.index(
  { einsatznummer: 1, 'einsatzTagebuch.items.nummer': 1 },
  { unique: true },
);
export const EinsatzSchema = schema;
