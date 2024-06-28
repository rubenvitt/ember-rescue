import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Person } from './person.entity';
import { Qualifikation } from './qualifikation.entity';

@Entity({ name: 'person_qualifikation' })
export class PersonQualifikation {
  @PrimaryColumn('varchar')
  id = createId();

  @ManyToOne(() => Person, (person) => person.qualifikationen)
  person: Person;

  @ManyToOne(
    () => Qualifikation,
    (qualifikation) => qualifikation.personQualifikationen,
  )
  qualifikation: Qualifikation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
