import React from 'react';
import { EinheitListItemComponent } from '../molecules/EinheitListItem.component.js';
import { EinheitDto } from '../../../types/app/einheit.types.js';

interface EinheitenlisteComponentProps {
  einheiten: EinheitDto[];
}

export const EinheitenlisteComponent: React.FC<EinheitenlisteComponentProps> = ({ einheiten }) => (
  <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
    {einheiten.map((einheit) => (
      <EinheitListItemComponent key={einheit.id} einheit={einheit} />
    ))}
  </ul>
);