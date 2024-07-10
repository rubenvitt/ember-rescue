export type BearbeiterDto = {
  id: string;
  name: string;
};

export type NewBearbeiterDto = Omit<BearbeiterDto, 'id'>;

export type QualifikationDto = {
  id: string;
  bezeichnung: string;
  abkuerzung: string;
};

export type SmallStatusDto = {
  id: string;
  code: string;
  bezeichnung: string;
};

export type StatusDto = SmallStatusDto & {
  beschreibung: string;
};

export type EinheitDto = {
  id: string;
  funkrufname: string;
  einheitTyp: {
    id: string;
    label: string;
  };
  einheitTypId?: string;
  kapazitaet: number;
  istTemporaer: boolean;
  status: SmallStatusDto;
};

export type CreateEinsatzDto = {
  erstAlarmiert: string;
  aufnehmendesRettungsmittel: string;
  alarmstichwort?: string;
};

export type CreateEinsatztagebuchDto = {
  content: string;
  type: string;
  absender: string;
  empfaenger: string;
  timestamp: string;
};
