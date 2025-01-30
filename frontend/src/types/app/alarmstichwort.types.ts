import { Identifiable, WithTimestamp } from '../utils/common.types.js';

export type Alarmstichwort = Identifiable &
  WithTimestamp & {
    code: string;
    description: string;
  };
