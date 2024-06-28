import { createId } from '@paralleldrive/cuid2';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from './status.entity';
import { EinsatzEinheit } from './einsatz-einheit.entity';
import { EinheitStatusHistorie } from './einheit-status-historie.entity';

@Entity({ name: 'einheit' })
export class Einheit {
  @PrimaryColumn('varchar')
  id = createId();

  @Column('varchar')
  funkrufname: string;

  @Column('varchar')
  typ: string;

  @Column('int')
  kapazitaet: number;

  @Column('boolean')
  istTemporaer: boolean = true;

  @ManyToOne(() => Status, (status) => status.einheiten)
  aktuellerStatus: Status;

  @OneToMany(() => EinsatzEinheit, (einsatzEinheit) => einsatzEinheit.einheit)
  einsatzEinheiten: EinsatzEinheit[];

  @OneToMany(() => EinheitStatusHistorie, (historie) => historie.einheit)
  statusHistorien: EinheitStatusHistorie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
