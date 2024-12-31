import { Prop, Schema } from '@nestjs/mongoose';
import {
  FachaufgabeId,
  OrganisationId,
  VerwaltungsstufeId,
} from 'taktische-zeichen-core';
import { TemplateDocument } from '@core/database';

// TODO: remove this:
export type FahrzeugIconDefinitionDto = {
  organisation: OrganisationId;
  fachaufgabe: FachaufgabeId;
  verwaltungsstufe: VerwaltungsstufeId;
};

// TODO: noch richtig so?
@Schema({ _id: false })
class FahrzeugIconDefinition {
  @Prop()
  organisation: string;
  @Prop()
  fachaufgabe: string;
  @Prop()
  verwaltungsstufe: string;
}

// Embedded Opta Schema
@Schema({ _id: false })
class EmbeddedOpta {
  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  bosCode: string;

  @Prop({ required: true })
  localCode: string;

  @Prop({ required: true })
  functionCode: string;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  ort: string;

  @Prop()
  supplement?: string;

  @Prop({ required: false })
  fullOpta: string;
}

@Schema({ timestamps: true, collection: 'fahrzeug-templates' })
export class VehiclesTemplate extends TemplateDocument {
  @Prop({ index: true, unique: true })
  fullOpta: string;

  @Prop()
  iconDefinition: FahrzeugIconDefinition;

  @Prop({
    required: true,
    type: EmbeddedOpta,
  })
  opta: EmbeddedOpta;

  @Prop()
  kapazitaet?: number;
}
