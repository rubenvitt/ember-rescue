import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TemplateRepository } from '@templates/template.repository';
import { Model } from 'mongoose';
import { UAVTemplate } from './uav-template.schema';
import { CreateUpdateUAVDto } from './uav.dto';

@Injectable()
export class UAVRepository extends TemplateRepository<UAVTemplate> {
    constructor(
        @InjectModel(UAVTemplate.name) model: Model<UAVTemplate>,
    ) {
        super(model, UAVRepository.name);
    }

    upsertMany(uavs: CreateUpdateUAVDto[]) {
        const operations = uavs.map(async ({ _id, ...uav }) => {
            this.logger.debug(`upserting UAV ${_id ?? uav.modell}`);

            const updateData = {
                ...uav,
            };

            const existingDoc = await this.model.findById(_id);

            this.logger.debug(`existingDoc: ${JSON.stringify(existingDoc)}`);

            if (existingDoc) {
                Object.assign(existingDoc, updateData);
                return existingDoc.save();
            } else {
                return this.model.create(updateData);
            }
        });

        return Promise.all(operations);
    }
} 