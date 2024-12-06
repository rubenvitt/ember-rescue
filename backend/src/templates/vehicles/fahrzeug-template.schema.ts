import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  FachaufgabeId,
  OrganisationId,
  VerwaltungsstufeId,
} from 'taktische-zeichen-core';
import { Opta } from '@templates/opta/schemas/opta.schema';
import mongoose from 'mongoose';
import { TemplateDocument } from '@core/database';

// TODO: remove this:
export type FahrzeugIconDefinitionDto = {
  organisation: OrganisationId;
  fachaufgabe: FachaufgabeId;
  verwaltungsstufe: VerwaltungsstufeId;
};

// TODO: noch richtig so?
@Schema()
class FahrzeugIconDefinition {
  @Prop()
  organisation: string;
  @Prop()
  fachaufgabe: string;
  @Prop()
  verwaltungsstufe: string;
}

@Schema({ timestamps: true, collection: 'fahrzeug-templates' })
export class FahrzeugTemplate extends TemplateDocument {
  @Prop({ required: true })
  fullOpta: string;

  @Prop()
  iconDefinition: FahrzeugIconDefinition;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opta',
  })
  opta: Opta;

  @Prop()
  kapazitaet?: number;
}

export const FahrzeugTemplateSchema =
  SchemaFactory.createForClass(FahrzeugTemplate);
