import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Bearbeiter } from '../bearbeiter/bearbeiter.entity';
import { EinsatztagebuchEintragType } from '@common-dtos/einsatztagebuch.dto';

@Entity({ name: 'einsatztagebuch_eintraege' })
export class EinsatztagebuchEintrag {
  @PrimaryColumn('varchar')
  id = createId();

  @ManyToOne(
    () => Bearbeiter,
    (bearbeiter) => bearbeiter.einsatzTagebuchEintraege,
  )
  @Index('etb_bearbeiter')
  bearbeiter: Bearbeiter;

  @Column('varchar')
  @Index('type')
  type: EinsatztagebuchEintragType;

  @Column('varchar')
  content: string;

  @Column('varchar')
  @Index('etb_absender')
  absender: string;

  @Column('varchar')
  @Index('etb_empfaenger')
  empfaenger: string;

  @Column('datetime')
  timestamp: string;
}
