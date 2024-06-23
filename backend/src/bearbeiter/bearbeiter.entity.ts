import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { createId } from '@paralleldrive/cuid2';

@Entity()
export class Bearbeiter {
  @PrimaryColumn('varchar')
  id = createId();

  @Column('varchar')
  @Index('name', { unique: true })
  name: string;

  @Column('boolean')
  active: boolean = true;
}
