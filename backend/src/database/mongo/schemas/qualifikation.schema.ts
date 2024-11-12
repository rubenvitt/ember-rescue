import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'qualifikationen', timestamps: true })
export class Qualifikation {
  @Prop({ required: true })
  bezeichnung: string;

  @Prop({ required: true })
  abkuerzung: string;
}

export const QualifikationSchema = SchemaFactory.createForClass(Qualifikation);
