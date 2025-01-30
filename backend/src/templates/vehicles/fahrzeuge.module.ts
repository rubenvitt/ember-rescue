import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { FahrzeugeService } from './fahrzeuge.service';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { VehiclesTemplate } from '@templates/vehicles/vehicles-template.schema';
import { VehiclesRepository } from '@templates/vehicles/vehicles.repository';
import { OptaModule } from '@templates/opta/opta.module';

@Module({
  controllers: [VehiclesController],
  providers: [FahrzeugeService, VehiclesRepository],
  imports: [
    OptaModule,
    MongooseModule.forFeatureAsync([
      {
        name: VehiclesTemplate.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(VehiclesTemplate);

          schema.pre('save', function (next) {
            if (this.isModified('opta')) {
              const {
                district,
                bosCode,
                ort,
                localCode,
                functionCode,
                orderNumber,
              } = this.opta;

              const parts = [district, bosCode, ort]
                .filter((part) => part)
                .join(' ');
              const codes = [localCode, functionCode]
                .filter((part) => part)
                .join('-');

              this.fullOpta = parts;
              if (codes) {
                this.fullOpta += ` ${codes}`;
              }
              if (orderNumber) {
                this.fullOpta += `-${orderNumber}`;
              }

              this.opta.fullOpta = this.fullOpta;
            }
            next();
          });

          return schema;
        },
      },
    ]),
  ],
  exports: [FahrzeugeService, VehiclesRepository],
})
export class FahrzeugeModule {}
