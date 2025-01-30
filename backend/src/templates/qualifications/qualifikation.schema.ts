import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TemplateDocument } from '@core/database';

@Schema({ collection: 'qualifikationen-templates', timestamps: true })
export class QualifikationTemplate extends TemplateDocument {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true, unique: true })
  abkuerzung: string;
}

export const QualifikationSchema = SchemaFactory.createForClass(
  QualifikationTemplate,
);
