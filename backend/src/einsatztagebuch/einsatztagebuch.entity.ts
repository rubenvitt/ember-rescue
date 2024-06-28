import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { Bearbeiter } from '../bearbeiter/bearbeiter.entity';
import { Einsatz } from '../einsatz/einsatz.entity';
import { EinsatztagebuchEintragType } from '@common-dtos/einsatztagebuch.dto';

@Entity({ name: 'einsatztagebuch_eintrag' })
export class EinsatztagebuchEintrag {
  @PrimaryColumn('varchar')
  id = createId();

  @ManyToOne(() => Einsatz, (einsatz) => einsatz.tagebuchEintraege)
  einsatz: Einsatz;

  @Column('datetime')
  zeitpunkt: Date;

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

  @ManyToOne(
    () => Bearbeiter,
    (bearbeiter) => bearbeiter.einsatzTagebuchEintraege,
  )
  bearbeiter: Bearbeiter;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
