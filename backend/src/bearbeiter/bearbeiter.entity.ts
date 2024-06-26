import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { EinsatztagebuchEintrag } from '../einsatztagebuch/einsatztagebuch.entity';

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
}
