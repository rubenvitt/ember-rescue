import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { PersonQualifikation } from './person-qualifikation.entity';

@Entity({ name: 'qualifikation' })
export class Qualifikation {
  @PrimaryColumn('varchar')
  id = createId();

  @Column('varchar')
  bezeichnung: string;

  @OneToMany(
    () => PersonQualifikation,
    (personQualifikation) => personQualifikation.qualifikation,
  )
  personQualifikationen: PersonQualifikation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
