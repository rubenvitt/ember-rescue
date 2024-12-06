export interface ITemplate {
  _id?: string;
  validFrom?: Date;
  validTo?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export let isCurrentlyActiveFilter = {
  isActive: true,
  $or: [
    {
      validTo: { $gte: new Date() },
    },
    {
      validTo: { $exists: false },
    },
  ],
};
