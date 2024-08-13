import { Identifiable } from '../utils/common.types.js';

export type NotizDto = Identifiable & { content: string, bearbeiter: { name: string } }
export type CreateNotizDto = Omit<NotizDto, 'id' | 'bearbeiter'>
export type UpdateNotizDto = Omit<NotizDto, 'id' | 'bearbeiter'>