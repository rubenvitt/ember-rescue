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
import { EinsatzEinheitKraft } from '../einheit/einsatz-einheit-kraft.entity';

@Entity({ name: 'person' })
export class Person {
  @PrimaryColumn('varchar')
  id = createId();

  @Column('varchar')
  name: string;

  @Column('varchar')
  telefonnummer: string;

  @Column('boolean')
  fuehrungskraft: boolean = false;

  @Column('boolean')
  istTemporaer: boolean = true;

  @OneToMany(
    () => PersonQualifikation,
    (personQualifikation) => personQualifikation.person,
  )
  qualifikationen: PersonQualifikation[];

  @OneToMany(
    () => EinsatzEinheitKraft,
    (einsatzEinheitKraft) => einsatzEinheitKraft.person,
  )
  einsatzEinheitKraefte: EinsatzEinheitKraft[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
