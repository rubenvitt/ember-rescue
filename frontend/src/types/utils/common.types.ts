import React from 'react';

import { Bearbeiter } from '../app/bearbeiter.types.js';

export type Identifiable = { id: string };
export type WithCreatedUpdatedAt = { createdAt: Date, updatedAt?: Date };
export type WithTimestamp = { timestamp: string };
export type WithBearbeiter = { bearbeiter: Bearbeiter };
export type IdentifiableWithTimestampAndBearbeiter = Identifiable & WithTimestamp & WithBearbeiter;
export type IdentifiableLabel = Identifiable & { name: string };
export type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>
export type WithIcon = {
  icon: SVGComponent;
}