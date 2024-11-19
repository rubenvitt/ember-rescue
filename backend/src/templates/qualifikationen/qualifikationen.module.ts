import { Module } from '@nestjs/common';
import { QualifikationenController } from './qualifikationen.controller';
import { QualifikationenRepository } from './qualifikationen.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QualifikationSchema,
  QualifikationTemplate,
} from '@templates/qualifikationen/qualifikation.schema';

@Module({
  controllers: [QualifikationenController],
  providers: [QualifikationenRepository],
  exports: [QualifikationenRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: QualifikationTemplate.name,
        schema: QualifikationSchema,
      },
    ]),
  ],
})
export class QualifikationenModule {}
