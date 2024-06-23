export type BearbeiterDto = {
  id: string;
  name: string;
}

export type NewBearbeiterDto = Omit<BearbeiterDto, 'id'>;