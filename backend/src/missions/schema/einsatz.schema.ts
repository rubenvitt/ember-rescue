import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import {
  Alarmstichwort,
  AlarmstichwortDto,
} from '@templates/alarmstichworte/alarmstichwort.schema';
import { Notiz } from '../notes/notiz.schema';
import { Reminder } from '../reminders/reminder.schema';
import { Status } from '@templates/status/status.schema';
import { QualifikationTemplate } from '@templates/qualifications/qualifikation.schema';
import { FahrzeugTemplate } from '@templates/vehicles/fahrzeug-template.schema';
import { BearbeiterDto } from '../../user/bearbeiter/core/bearbeiter.dto';
import { JournalEntryType } from '../journal/journal.dto';

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

@Schema({ timestamps: true })
export class FahrzeugOnEinsatz extends FahrzeugTemplate {
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
  type: JournalEntryType;
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
  aufnehmendesRettungsmittel: string;

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
