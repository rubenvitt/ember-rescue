import { Module, Provider } from '@nestjs/common';
import { SchemaModule } from './schema/schema.module';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { BosOptaSchema } from '@templates/opta/schemas/bos-opta.schema';
import { DistrictOptaSchema } from '@templates/opta/schemas/district-opta.schema';
import { BaseOptaTemplate } from '@templates/opta/schemas/base-opta.schema';
import { OptaType } from '@templates/opta/constants';
import { LocalCodeOptaSchema } from '@templates/opta/schemas/local-code-opta.schema';
import { FunctionOptaSchema } from '@templates/opta/schemas/function-opta.schema';
import { Opta } from '@templates/opta/schemas/opta.schema';
import { OptaRepository } from '@templates/opta/repositories/opta.repository';
import { BosOptaRepository } from '@templates/opta/repositories/bos-opta.repository';
import { DistrictOptaRepository } from '@templates/opta/repositories/district-opta.repository';
import { FunctionOptaRepository } from '@templates/opta/repositories/function-opta.repository';
import { LocalCodeOptaRepository } from '@templates/opta/repositories/local-code-opta.repository';
import { OptaController } from '@templates/opta/opta.controller';

const repositories: Provider[] = [
  OptaRepository,
  BosOptaRepository,
  DistrictOptaRepository,
  FunctionOptaRepository,
  LocalCodeOptaRepository,
];

@Module({
  providers: [...repositories],
  exports: [...repositories],
  controllers: [OptaController],
  imports: [
    SchemaModule,
    MongooseModule.forFeatureAsync([
      {
        name: Opta.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Opta);

          schema.path('fullOpta').index({ unique: true });

          // Automatische Generierung der fullOpta
          schema.pre('save', function (next) {
            if (
              this.isModified('ort') ||
              this.isModified('bosCode') ||
              this.isModified('district') ||
              this.isModified('localCode') ||
              this.isModified('functionCode') ||
              this.isModified('orderNumber')
            ) {
              // [DISTRICT] [BOS] [LOCAL_CODE]-[FUNCTION_CODE]-orderNumber
              const parts = [
                this.district ? `${this.district}` : '',
                this.bosCode ? `${this.bosCode}` : '',
                this.ort ? `${this.ort}` : '',
                this.localCode ? `${this.localCode}` : '',
                this.functionCode ? `${this.functionCode}` : '',
                this.orderNumber ? `${this.orderNumber}` : '',
              ];

              const [
                districtPart,
                bosCodePart,
                ortPart,
                localCodePart,
                functionCodePart,
                orderNumberPart,
              ] = parts.filter((part) => part !== '');

              this.fullOpta = [districtPart, bosCodePart, ortPart]
                .filter((part) => part)
                .join(' ');

              const codesPart = [localCodePart, functionCodePart]
                .filter((part) => part)
                .join('-');

              if (codesPart) {
                this.fullOpta += ` ${codesPart}`;
              }

              if (orderNumberPart) {
                this.fullOpta += `-${orderNumberPart}`;
              }
            }

            next();
          });

          return schema;
        },
      },
      {
        name: BaseOptaTemplate.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(BaseOptaTemplate);
          schema.index({ code: 1, type: 1 }, { unique: true });
          schema.pre('save', function (next) {
            if (!Object.values(OptaType).includes(this.type)) {
              return next(
                new Error(
                  `Invalid type: ${this['type']}. Type must be one of '${Object.keys(OptaType).join("', '")}'.`,
                ),
              );
            }
            next();
          });

          return schema;
        },
        discriminators: [
          { name: OptaType.DISTRICT, schema: DistrictOptaSchema },
          { name: OptaType.BOS_CODE, schema: BosOptaSchema },
          { name: OptaType.DISTRICT, schema: DistrictOptaSchema },
          { name: OptaType.LOCAL_CODE, schema: LocalCodeOptaSchema },
          { name: OptaType.FUNCTION_CODE, schema: FunctionOptaSchema },
        ],
      },
    ]),
  ],
})
export class OptaModule {}
