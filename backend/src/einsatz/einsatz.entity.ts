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
import { Bearbeiter } from '../bearbeiter/bearbeiter.entity';
import { EinsatztagebuchEintrag } from '../einsatztagebuch/einsatztagebuch.entity';
import { EinsatzEinheit } from '../einheit/einsatz-einheit.entity';
import { EinheitStatusHistorie } from '../einheit/einheit-status-historie.entity';

@Entity({ name: 'einsatz' })
export class Einsatz {
  @PrimaryColumn('varchar')
  id = createId();

  @Column('timestamp')
  beginn: Date;

  @Column('timestamp', { nullable: true })
  ende: Date;

  @ManyToOne(() => Bearbeiter, (bearbeiter) => bearbeiter.einsaetze)
  bearbeiter: Bearbeiter;

  @OneToMany(() => EinsatzEinheit, (einsatzEinheit) => einsatzEinheit.einsatz)
  einsatzEinheiten: EinsatzEinheit[];

  @OneToMany(() => EinsatztagebuchEintrag, (eintrag) => eintrag.einsatz)
  tagebuchEintraege: EinsatztagebuchEintrag[];

  @OneToMany(() => EinheitStatusHistorie, (historie) => historie.einsatz)
  statusHistorien: EinheitStatusHistorie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
