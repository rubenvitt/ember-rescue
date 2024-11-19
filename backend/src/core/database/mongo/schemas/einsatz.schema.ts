import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import { BearbeiterDto } from './bearbeiter.schema';
import { EinsatztagebuchEintragType } from '../../../../types';
import {
  Alarmstichwort,
  AlarmstichwortDto,
} from '@templates/alarms/alarmstichwort.schema';
import { Notiz } from './einsatz/notiz.schema';
import { Reminder } from './einsatz/reminder.schema';
import { Status } from './status.schema';
import { Qualifikation } from './qualifikation.schema';
import { Fahrzeug } from './fahrzeug.schema';

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
  qualifikation: Qualifikation;

  @Prop()
  telefonnummer: string;

  @Prop({ default: false })
  isFuehrungskraft: boolean;
}

@Schema({ timestamps: true })
export class FahrzeugOnEinsatz extends Fahrzeug {
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
}

export type FahrzeugOnEinsatzDto = {
  einsatzbeginn: Date;
  einsatzende?: Date; // Optional field
  personal: {
    name: string;
    qualifikation: Qualifikation;
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
  items: EinsatztagebuchEintrag[];
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
  @Prop({ required: true })
  beginn: Date;
  @Prop()
  ende: Date;
  @Prop()
  abgeschlossen: Date;
  @Prop({ type: Number, unique: true })
  einsatznummer: number;

  @Prop({ required: true })
  bearbeiter: BearbeiterDto;

  @Prop({ required: true })
  aufnehmendesRettungsmittel: string; // FIXME with new model

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

// let schema = SchemaFactory.createForClass(Einsatz);
// schema.index(
//   { einsatznummer: 1, 'einsatzTagebuch.items.nummer': 1 },
//   { unique: true },
// );
//
// export const EinsatzSchema = schema;
