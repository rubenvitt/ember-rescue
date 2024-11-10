import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import * as mongooseFieldEncryption from 'mongoose-field-encryption';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Secret extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  value: string;
}

const SecretSchema = SchemaFactory.createForClass(Secret);

SecretSchema.plugin(mongooseFieldEncryption.fieldEncryption, {
  fields: ['value'],
  secret: process.env.ENCRYPTION_KEY,
  saltGenerator: () => crypto.randomBytes(8).toString('hex'),
});

export { SecretSchema };
