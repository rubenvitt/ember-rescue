import { Identifiable } from '../utils/common.types.js';

export type Bearbeiter = Identifiable & {
  name: string;
};

export type CreateBearbeiter = {
  name: string;
  id: null
}