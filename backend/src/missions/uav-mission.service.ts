import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UAVTemplate } from '@templates/uav/uav-template.schema';
import { Model } from 'mongoose';
import { CreateUAVMissionDto, FlightProtocolDto, PostFlightChecksDto, PreFlightChecksDto } from './dto/uav-mission.dto';
import { Einsatz } from './schema/einsatz.schema';
import { UAVMission } from './schema/uav-mission.schema';

@Injectable()
export class UAVMissionService {
    constructor(
        @InjectModel(Einsatz.name) private einsatzModel: Model<Einsatz>,
        @InjectModel(UAVTemplate.name) private uavTemplateModel: Model<UAVTemplate>,
    ) { }

    async addUAVToEinsatz(createDto: CreateUAVMissionDto) {
        const einsatz = await this.einsatzModel.findById(createDto.einsatzId);
        if (!einsatz) {
            throw new NotFoundException('Einsatz nicht gefunden');
        }

        const uavTemplate = await this.uavTemplateModel.findById(createDto.uavId);
        if (!uavTemplate) {
            throw new NotFoundException('UAV Template nicht gefunden');
        }

        const uavMission: Partial<UAVMission> = {
            index: einsatz.uavMissions.length,
            uav: uavTemplate,
            status: 'PREFLIGHT_CHECKS' as const,
            flightProtocols: [],
        };

        einsatz.uavMissions.push(uavMission as UAVMission);
        await einsatz.save();

        return uavMission;
    }

    async submitPreFlightChecks(einsatzId: string, uavIndex: number, preFlightData: PreFlightChecksDto) {
        const einsatz = await this.einsatzModel.findById(einsatzId);
        if (!einsatz) {
            throw new NotFoundException('Einsatz nicht gefunden');
        }

        if (!einsatz.uavMissions[uavIndex]) {
            throw new NotFoundException('UAV Mission nicht gefunden');
        }

        einsatz.uavMissions[uavIndex].preFlightChecks = preFlightData;
        einsatz.uavMissions[uavIndex].status = 'ACTIVE';

        await einsatz.save();
        return einsatz.uavMissions[uavIndex];
    }

    async addFlightProtocol(einsatzId: string, uavIndex: number, flightData: FlightProtocolDto) {
        const einsatz = await this.einsatzModel.findById(einsatzId);
        if (!einsatz) {
            throw new NotFoundException('Einsatz nicht gefunden');
        }

        const uavMission = einsatz.uavMissions[uavIndex];
        if (!uavMission) {
            throw new NotFoundException('UAV Mission nicht gefunden');
        }

        if (uavMission.status !== 'ACTIVE') {
            throw new Error('Pre-Flight Checks müssen zuerst abgeschlossen werden');
        }

        const protocolWithIndex = {
            ...flightData,
            index: uavMission.flightProtocols.length
        };

        uavMission.flightProtocols.push(protocolWithIndex);
        await einsatz.save();

        return protocolWithIndex;
    }

    async submitPostFlightChecks(einsatzId: string, uavIndex: number, postFlightData: PostFlightChecksDto) {
        const einsatz = await this.einsatzModel.findById(einsatzId);
        if (!einsatz) {
            throw new NotFoundException('Einsatz nicht gefunden');
        }

        if (!einsatz.uavMissions[uavIndex]) {
            throw new NotFoundException('UAV Mission nicht gefunden');
        }

        einsatz.uavMissions[uavIndex].postFlightChecks = postFlightData;
        einsatz.uavMissions[uavIndex].status = 'COMPLETED';

        await einsatz.save();
        return einsatz.uavMissions[uavIndex];
    }

    async getUAVMission(einsatzId: string, uavIndex: number) {
        const einsatz = await this.einsatzModel.findById(einsatzId);
        if (!einsatz) {
            throw new NotFoundException('Einsatz nicht gefunden');
        }

        const uavMission = einsatz.uavMissions[uavIndex];
        if (!uavMission) {
            throw new NotFoundException('UAV Mission nicht gefunden');
        }

        return uavMission;
    }

    async getAllUAVMissions(einsatzId: string) {
        const einsatz = await this.einsatzModel.findById(einsatzId);
        if (!einsatz) {
            throw new NotFoundException('Einsatz nicht gefunden');
        }

        return einsatz.uavMissions;
    }
} 