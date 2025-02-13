import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUAVMissionDto, FlightProtocolDto, FlightProtocolResponse, PostFlightChecksDto, PreFlightChecksDto, UAVMissionResponse, UAVMissionsResponse } from './dto/uav-mission.dto';
import { UAVMissionService } from './uav-mission.service';

@ApiTags('UAV Missions')
@Controller('einsaetze/:einsatzId/uav')
export class UAVMissionController {
    constructor(private readonly uavMissionService: UAVMissionService) { }

    @Post()
    @ApiOperation({ summary: 'Add a UAV to an Einsatz' })
    @ApiParam({ name: 'einsatzId', type: String })
    @ApiBody({ type: CreateUAVMissionDto })
    @ApiOkResponse({ type: UAVMissionResponse, description: 'UAV successfully added to mission' })
    async addUAVToEinsatz(
        @Param('einsatzId') einsatzId: string,
        @Body() createDto: CreateUAVMissionDto
    ) {
        return this.uavMissionService.addUAVToEinsatz({
            ...createDto,
            einsatzId,
        });
    }

    @Put(':uavIndex/pre-flight')
    @ApiOperation({ summary: 'Submit pre-flight checks' })
    @ApiParam({ name: 'einsatzId', type: String })
    @ApiParam({ name: 'uavIndex', type: Number })
    @ApiBody({ type: PreFlightChecksDto })
    @ApiOkResponse({ type: UAVMissionResponse, description: 'Pre-flight checks submitted successfully' })
    async submitPreFlightChecks(
        @Param('einsatzId') einsatzId: string,
        @Param('uavIndex') uavIndex: number,
        @Body() preFlightData: PreFlightChecksDto
    ) {
        return this.uavMissionService.submitPreFlightChecks(
            einsatzId,
            uavIndex,
            preFlightData
        );
    }

    @Post(':uavIndex/flight')
    @ApiOperation({ summary: 'Add a flight protocol' })
    @ApiParam({ name: 'einsatzId', type: String })
    @ApiParam({ name: 'uavIndex', type: Number })
    @ApiBody({ type: FlightProtocolDto })
    @ApiOkResponse({ type: FlightProtocolResponse, description: 'Flight protocol added successfully' })
    async addFlightProtocol(
        @Param('einsatzId') einsatzId: string,
        @Param('uavIndex') uavIndex: number,
        @Body() flightData: FlightProtocolDto
    ) {
        return this.uavMissionService.addFlightProtocol(
            einsatzId,
            uavIndex,
            flightData
        );
    }

    @Put(':uavIndex/post-flight')
    @ApiOperation({ summary: 'Submit post-flight checks' })
    @ApiParam({ name: 'einsatzId', type: String })
    @ApiParam({ name: 'uavIndex', type: Number })
    @ApiBody({ type: PostFlightChecksDto })
    @ApiOkResponse({ type: UAVMissionResponse, description: 'Post-flight checks submitted successfully' })
    async submitPostFlightChecks(
        @Param('einsatzId') einsatzId: string,
        @Param('uavIndex') uavIndex: number,
        @Body() postFlightData: PostFlightChecksDto
    ) {
        return this.uavMissionService.submitPostFlightChecks(
            einsatzId,
            uavIndex,
            postFlightData
        );
    }

    @Get(':uavIndex')
    @ApiOperation({ summary: 'Get a specific UAV mission' })
    @ApiParam({ name: 'einsatzId', type: String })
    @ApiParam({ name: 'uavIndex', type: Number })
    @ApiOkResponse({ type: UAVMissionResponse, description: 'UAV mission details' })
    async getUAVMission(
        @Param('einsatzId') einsatzId: string,
        @Param('uavIndex') uavIndex: number
    ) {
        return this.uavMissionService.getUAVMission(einsatzId, uavIndex);
    }

    @Get()
    @ApiOperation({ summary: 'Get all UAV missions for an Einsatz' })
    @ApiParam({ name: 'einsatzId', type: String })
    @ApiOkResponse({ type: UAVMissionsResponse, description: 'List of all UAV missions' })
    async getAllUAVMissions(@Param('einsatzId') einsatzId: string) {
        const missions = await this.uavMissionService.getAllUAVMissions(einsatzId);
        return { missions };
    }
} 