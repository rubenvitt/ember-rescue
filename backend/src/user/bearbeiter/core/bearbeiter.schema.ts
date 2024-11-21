import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

export class BearbeiterDto {
  readonly id: string;
  readonly name: string;
  readonly active: boolean;

  constructor(data?: BearbeiterDto) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.active = data.active;
    }
  }

  static async fromBearbeiter(
    bearbeiter: Bearbeiter | Promise<Bearbeiter> | null | undefined,
  ): Promise<BearbeiterDto> {
    if (!bearbeiter) {
      throw new NotFoundException('Bearbeiter not found', {
        description: 'Bearbeiter not found',
      });
    }
    return await Promise.resolve(bearbeiter).then(
      (bearbeiter) =>
        new BearbeiterDto({
          id: bearbeiter._id as string,
          active: bearbeiter.active,
          name: bearbeiter.name,
        }),
    );
  }
}

@Schema({ timestamps: true })
export class Bearbeiter extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: true })
  active: boolean;
}

export const BearbeiterSchema = SchemaFactory.createForClass(Bearbeiter);
