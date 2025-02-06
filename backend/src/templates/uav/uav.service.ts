import { ValidationException } from '@core/exceptions/validation.exception';
import { Injectable } from '@nestjs/common';
import { validateKey } from 'src/utils/validation.utils';
import { ImportManyUAVsDto } from './uav.dto';
import { UAVRepository } from './uav.repository';

@Injectable()
export class UAVService {

    constructor(private readonly uavRepository: UAVRepository) { }

    async findAll() {
        return this.uavRepository.findActive();
    }

    async deleteUAV(id: string) {
        await this.uavRepository.deleteOne({ _id: validateKey(id) });
    }

    async updateMany(dto: ImportManyUAVsDto) {
        try {
            await this.uavRepository.upsertMany(dto.items);
        } catch (e) {
            throw new ValidationException({
                property: 'uavs',
                constraints: e.message
            });
        }
    }

    async importUAVs(dto: ImportManyUAVsDto) {
        try {
            await this.uavRepository.upsertMany(dto.items);
        } catch (e) {
            throw new ValidationException({
                property: 'uavs',
                constraints: e.message
            });
        }
    }
} 