enum DocumentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

type BaseOptaEntry = {
  code: string;
  label: string;
  status: DocumentStatus;
  validFrom: string;
  validTo?: string;
};

type SimpleOptaEntry = BaseOptaEntry & {
  description?: string;
};

export type Opta = {
  fullOpta: string;

  district: BaseOptaEntry;
  bosCode: SimpleOptaEntry & { group: string; rufname: string };
  localCode: BaseOptaEntry & { group: string };
  functionCode: SimpleOptaEntry & { group: string };
  orderNumber: number;
  ort: string;
  supplement?: string;
  isActive: boolean;
};
