import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { EinsatzEinheit } from './einsatz-einheit.entity';
import { Person } from '../person/person.entity';

@Entity({ name: 'einsatz_einheit_kraft' })
export class EinsatzEinheitKraft {
  @PrimaryColumn('varchar')
  id = createId();

  @ManyToOne(() => EinsatzEinheit, (einsatzEinheit) => einsatzEinheit.kraefte)
  einsatzEinheit: EinsatzEinheit;

  @ManyToOne(() => Person, (person) => person.einsatzEinheitKraefte)
  person: Person;

  @Column('boolean')
  fahrzeugfuehrer: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
