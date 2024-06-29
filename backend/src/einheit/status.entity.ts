import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Einheit } from './einheit.entity';
import { EinheitStatusHistorie } from './einheit-status-historie.entity';

@Entity({ name: 'status' })
export class Status {
  @PrimaryColumn('varchar')
  id = createId();

  @Column('integer')
  code: number;

  @Column('varchar')
  bezeichnung: string;

  @Column('varchar')
  beschreibung: string;

  @OneToMany(() => Einheit, (einheit) => einheit.aktuellerStatus)
  einheiten: Einheit[];

  @OneToMany(() => EinheitStatusHistorie, (historie) => historie.status)
  statusHistorien: EinheitStatusHistorie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
