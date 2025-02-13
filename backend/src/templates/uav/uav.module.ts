import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { UAVTemplate } from './uav-template.schema';
import { UAVController } from './uav.controller';
import { UAVRepository } from './uav.repository';
import { UAVService } from './uav.service';

@Module({
    controllers: [UAVController],
    providers: [UAVService, UAVRepository],
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: UAVTemplate.name,
                useFactory: () => {
                    const schema = SchemaFactory.createForClass(UAVTemplate);
                    return schema;
                },
            },
        ]),
    ],
    exports: [UAVService, UAVRepository, MongooseModule],
})
export class UAVModule { } 