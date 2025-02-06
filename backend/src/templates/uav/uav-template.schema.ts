import { TemplateDocument } from '@core/database';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true, _id: false })
export class EmbeddedUAVTemplate extends TemplateDocument {
    @Prop({ required: true })
    modell: string;

    @Prop({ required: true })
    seriennummer: string;

    @Prop({ required: true })
    konfiguration: string;

    @Prop({ required: true })
    nutzlast: string;

    @Prop()
    firmware: string;

    @Prop()
    maxFlugzeit?: number; // in Minuten

    @Prop()
    maxFlughoehe?: number; // in Metern

    @Prop()
    maxGeschwindigkeit?: number; // in km/h

    @Prop()
    gewicht?: number; // in kg
}

@Schema({ timestamps: true, collection: 'uav-templates' })
export class UAVTemplate extends TemplateDocument {
    @Prop({ index: true })
    modell: string;

    @Prop({ required: true, unique: true })
    seriennummer: string;

    @Prop({ required: true })
    konfiguration: string;

    @Prop({ required: true })
    nutzlast: string;

    @Prop()
    firmware: string;

    @Prop()
    maxFlugzeit?: number; // in Minuten

    @Prop()
    maxFlughoehe?: number; // in Metern

    @Prop()
    maxGeschwindigkeit?: number; // in km/h

    @Prop()
    gewicht?: number; // in kg
} 