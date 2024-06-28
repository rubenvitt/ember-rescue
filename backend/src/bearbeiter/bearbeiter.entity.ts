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
import { Person } from '../person/person.entity';
import { Einheit } from '../einheit/einheit.entity';
import { Qualifikation } from '../person/qualifikation.entity';
import { Status } from '../einheit/status.entity';
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

  @OneToMany(() => Person, (person) => person.bearbeiter)
  personen: Person[];

  @OneToMany(() => Einheit, (einheit) => einheit.bearbeiter)
  einheiten: Einheit[];

  @OneToMany(() => Qualifikation, (qualifikation) => qualifikation.bearbeiter)
  qualifikationen: Qualifikation[];

  @OneToMany(() => Status, (status) => status.bearbeiter)
  statusse: Status[];

  @OneToMany(() => EinheitStatusHistorie, (historie) => historie.bearbeiter)
  statusHistorien: EinheitStatusHistorie[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
