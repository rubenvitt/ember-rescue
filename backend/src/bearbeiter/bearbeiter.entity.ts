import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { EinsatztagebuchEintrag } from '../einsatztagebuch/einsatztagebuch.entity';
import { Einsatz } from '../einsatz/einsatz.entity';
import { EinheitStatusHistorie } from '../einheit/einheit-status-historie.entity';

@Entity({ name: 'bearbeiter' })
export class Bearbeiter {
  @PrimaryColumn('varchar')
  id = createId();

  @Column('varchar')
  @Index('bearbeiter_name', { unique: true })
  name: string;

  @Column('boolean')
  active: boolean = true;

  @OneToMany(
    () => EinsatztagebuchEintrag,
    (einsatztagebuchEintrag) => einsatztagebuchEintrag.bearbeiter,
  )
  einsatzTagebuchEintraege: EinsatztagebuchEintrag[];

  @OneToMany(() => Einsatz, (einsatz) => einsatz.bearbeiter)
  einsaetze: Einsatz[];

  @OneToMany(() => EinheitStatusHistorie, (historie) => historie.bearbeiter)
  statusHistorien: EinheitStatusHistorie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
