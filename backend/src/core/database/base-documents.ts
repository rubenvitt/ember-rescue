import { Document } from 'mongoose';
import { ITemplate } from '@templates/core/interfaces/template.interface';
import { Prop } from '@nestjs/mongoose';

export abstract class BaseDocument extends Document<string> {}

export abstract class TemplateDocument
  extends BaseDocument
  implements ITemplate
{
  @Prop({ required: true, default: new Date() })
  validFrom: Date;

  @Prop({})
  validTo?: Date;

  @Prop({ isRequired: true, default: true })
  isActive?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
