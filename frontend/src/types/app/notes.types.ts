import { Identifiable, WithCreatedUpdatedAt } from '../utils/common.types.js';

export type NotizDto = Identifiable & WithCreatedUpdatedAt & {
  content: string,
  bearbeiter: { name: string },
  doneAt?: Date,
  reminder: Date,
}
export type CreateNotizDto = Pick<NotizDto, 'content'>
export type UpdateNotizDto = Pick<NotizDto, 'content'>