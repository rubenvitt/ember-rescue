import { Identifiable, WithCreatedUpdatedAt } from '../utils/common.types.js';

export type Bearbeiter = Identifiable &
  WithCreatedUpdatedAt & {
    name: string;
    active: boolean;
  };

export type CreateBearbeiter = {
  name: string;
};
