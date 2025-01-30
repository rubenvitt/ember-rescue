import { Prop, Schema } from '@nestjs/mongoose';
import { TemplateDocument } from '@core/database';

@Schema({ timestamps: true, collection: 'optas' })
export class Opta extends TemplateDocument {
  @Prop({
    required: true,
  })
  district: string;

  @Prop({
    required: true,
  })
  bosCode: string;

  @Prop({
    required: true,
  })
  localCode: string;

  @Prop({
    required: true,
  })
  functionCode: string;

  @Prop({
    required: true,
  })
  orderNumber: string;

  @Prop({
    required: true,
  })
  ort: string;

  @Prop()
  supplement?: string;

  @Prop()
  fullOpta: string;
}
