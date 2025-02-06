import { CacheKey } from '@nestjs/cache-manager';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Logger,
    Param,
    Patch,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { BearbeiterGuard } from '../../user/bearbeiter/core/bearbeiter.guard';
import {
    ImportManyUAVsDto,
    ManyUAVTemplateResponse,
    UAVTemplateDto,
} from './uav.dto';
import { UAVService } from './uav.service';

@Controller('templates/uav')
@UseGuards(BearbeiterGuard)
export class UAVController {
    private readonly logger = new Logger(UAVController.name);

    constructor(
        private readonly uavService: UAVService,
    ) { }

    @Get()
    @CacheKey('uavs')
    @ApiOkResponse({
        type: ManyUAVTemplateResponse,
        description: 'List of all UAVs (templates)',
    })
    findAll(): Promise<UAVTemplateDto[]> {
        return this.uavService.findAll();
    }

    @Patch()
    @ApiBody({
        type: ImportManyUAVsDto,
        description: 'Update many UAVs',
    })
    async updateMany(
        @Body() uavs: ImportManyUAVsDto,
        @Res() response: Response,
    ) {
        await this.uavService.updateMany(uavs);
        response.status(HttpStatus.OK);
        response.send({ status: 'UAVs updated successfully' });
    }

    @Delete(':uavId')
    @ApiOkResponse({
        description: 'Delete a UAV template by id',
    })
    @ApiParam({
        name: 'uavId',
        required: true,
        type: String,
        description: 'UAV ID',
    })
    async deleteUAV(@Param('uavId') uavId: string) {
        await this.uavService.deleteUAV(uavId);
    }

    @Post('/import')
    @ApiBody({
        type: ImportManyUAVsDto,
        description: 'Import many UAVs',
    })
    async importUAVs(
        @Body() uavs: ImportManyUAVsDto,
        @Res() response: Response,
    ) {
        this.logger.debug(
            'Importing UAVs',
            JSON.stringify(uavs, null, 2),
        );
        await this.uavService.importUAVs(uavs);
        response.status(HttpStatus.OK);
        response.send({ status: 'UAVs updated successfully' });
    }
} 