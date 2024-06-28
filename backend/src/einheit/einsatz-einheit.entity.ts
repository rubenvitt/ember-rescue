import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Einsatz } from '../einsatz/einsatz.entity';
import { Einheit } from './einheit.entity';
import { EinsatzEinheitKraft } from './einsatz-einheit-kraft.entity';

@Entity({ name: 'einsatz_einheit' })
export class EinsatzEinheit {
  @PrimaryColumn('varchar')
  id = createId();

  @ManyToOne(() => Einsatz, (einsatz) => einsatz.einsatzEinheiten)
  einsatz: Einsatz;

  @ManyToOne(() => Einheit, (einheit) => einheit.einsatzEinheiten)
  einheit: Einheit;

  @Column('timestamp')
  einsatzbeginn: Date;

  @Column('timestamp', { nullable: true })
  einsatzende: Date;

  @OneToMany(() => EinsatzEinheitKraft, (kraft) => kraft.einsatzEinheit)
  kraefte: EinsatzEinheitKraft[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
