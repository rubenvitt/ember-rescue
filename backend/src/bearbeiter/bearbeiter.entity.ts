import { Entity, PrimaryColumn } from 'typeorm';
import { createId } from '@paralleldrive/cuid2';

@Entity()
export class Bearbeiter {
  @PrimaryColumn('varchar')
  id = createId();

  @PrimaryColumn('varchar')
  name: string;
}