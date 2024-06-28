import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Einheit } from './einheit.entity';
import { Status } from './status.entity';
import { Bearbeiter } from '../bearbeiter/bearbeiter.entity';
import { Einsatz } from '../einsatz/einsatz.entity';

@Entity({ name: 'einheit_status_historie' })
export class EinheitStatusHistorie {
  @PrimaryColumn('varchar')
  id = createId();

  @ManyToOne(() => Einheit, (einheit) => einheit.statusHistorien)
  einheit: Einheit;

  @ManyToOne(() => Status, (status) => status.statusHistorien)
  status: Status;

  @Column('timestamp')
  zeitpunkt: Date;

  @ManyToOne(() => Bearbeiter, (bearbeiter) => bearbeiter.statusHistorien)
  bearbeiter: Bearbeiter;

  @ManyToOne(() => Einsatz, (einsatz) => einsatz.statusHistorien)
  einsatz: Einsatz;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
