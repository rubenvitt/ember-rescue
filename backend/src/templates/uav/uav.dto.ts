import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { ApiResponse } from '../../types';


export class UAVTemplateDto {
    @ApiProperty({ required: true })
    _id?: string;

    @ApiProperty({ required: true })
    modell: string;

    @ApiProperty({ required: true })
    seriennummer: string;

    @ApiProperty({ required: true })
    konfiguration: string;

    @ApiProperty({ required: true })
    nutzlast: string;

    @ApiProperty({ required: false })
    firmware?: string;

    @ApiProperty({ required: false })
    maxFlugzeit?: number;

    @ApiProperty({ required: false })
    maxFlughoehe?: number;

    @ApiProperty({ required: false })
    maxGeschwindigkeit?: number;

    @ApiProperty({ required: false })
    gewicht?: number;
}

export class CreateUpdateUAVDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString({ message: 'ID muss ein Text sein' })
    _id?: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Modell darf nicht leer sein' })
    @IsString({ message: 'Modell muss ein Text sein' })
    modell: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Seriennummer darf nicht leer sein' })
    @IsString({ message: 'Seriennummer muss ein Text sein' })
    seriennummer: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Konfiguration darf nicht leer sein' })
    @IsString({ message: 'Konfiguration muss ein Text sein' })
    konfiguration: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({ message: 'Nutzlast darf nicht leer sein' })
    @IsString({ message: 'Nutzlast muss ein Text sein' })
    nutzlast: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString({ message: 'Firmware muss ein Text sein' })
    firmware?: string;

    @ApiProperty({ required: false, description: 'Maximale Flugzeit in Minuten' })
    @IsNumber({}, { message: 'Maximale Flugzeit muss eine Zahl sein' })
    @Min(0, { message: 'Maximale Flugzeit muss größer als 0 sein' })
    @Max(1000, { message: 'Maximale Flugzeit darf nicht größer als 1000 Minuten sein' })
    @IsOptional()
    maxFlugzeit?: number;

    @ApiProperty({ required: false, description: 'Maximale Flughöhe in Metern' })
    @IsNumber({}, { message: 'Maximale Flughöhe muss eine Zahl sein' })
    @Min(0, { message: 'Maximale Flughöhe muss größer als 0 sein' })
    @Max(10000, { message: 'Maximale Flughöhe darf nicht größer als 10000 Meter sein' })
    @IsOptional()
    maxFlughoehe?: number;

    @ApiProperty({ required: false, description: 'Maximale Geschwindigkeit in km/h' })
    @IsNumber({}, { message: 'Maximale Geschwindigkeit muss eine Zahl sein' })
    @Min(0, { message: 'Maximale Geschwindigkeit muss größer als 0 sein' })
    @Max(150, { message: 'Maximale Geschwindigkeit darf nicht größer als 150 km/h sein' })
    @IsOptional()
    maxGeschwindigkeit?: number;

    @ApiProperty({ required: false, description: 'Gewicht in kg' })
    @IsNumber({}, { message: 'Gewicht muss eine Zahl sein' })
    @Min(0, { message: 'Gewicht muss größer als 0 sein' })
    @Max(150, { message: 'Gewicht darf nicht größer als 150 kg sein' })
    @IsOptional()
    gewicht?: number;
}

export class ImportManyUAVsDto {
    @ApiProperty({ required: true, type: CreateUpdateUAVDto, isArray: true })
    @IsArray({ message: 'Die Daten müssen als Array übergeben werden' })
    @ArrayNotEmpty({ message: 'Es muss mindestens ein UAV-Template übergeben werden' })
    @ValidateNested({ each: true })
    @Type(() => CreateUpdateUAVDto)
    items: CreateUpdateUAVDto[];
}

export class ManyUAVTemplateResponse extends ApiResponse<UAVTemplateDto[]> {
    @ApiProperty({
        type: UAVTemplateDto,
        isArray: true,
        description: 'List of UAVs',
    })
    data: UAVTemplateDto[];
} 