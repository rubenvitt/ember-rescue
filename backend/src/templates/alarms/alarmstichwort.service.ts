import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Alarmstichwort } from '@templates/alarms/alarmstichwort.schema';
import { Model } from 'mongoose';
import { BaseTemplateRepository } from '@templates/base-template.repository';

@Injectable()
export class AlarmstichwortService extends BaseTemplateRepository<Alarmstichwort> {
  constructor(
    @InjectModel(Alarmstichwort.name)
    readonly alarmstichwortModel: Model<Alarmstichwort>,
  ) {
    super(alarmstichwortModel, AlarmstichwortService.name);
  }
}
