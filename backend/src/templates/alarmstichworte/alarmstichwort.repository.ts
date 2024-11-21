import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Alarmstichwort } from '@templates/alarmstichworte/alarmstichwort.schema';
import { Model } from 'mongoose';
import { TemplateRepository } from '@templates/template.repository';

@Injectable()
export class AlarmstichwortRepository extends TemplateRepository<Alarmstichwort> {
  constructor(
    @InjectModel(Alarmstichwort.name)
    readonly alarmstichwortModel: Model<Alarmstichwort>,
  ) {
    super(alarmstichwortModel, AlarmstichwortRepository.name);
  }
}
