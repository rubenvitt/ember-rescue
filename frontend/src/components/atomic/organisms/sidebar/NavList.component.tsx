import React from 'react';
import { NavListProps } from '../../../../types/ui/nav.types.js';
import { NavItemComponent } from '../NavItemComponent.js';

export const NavListComponent: React.FC<NavListProps> = ({ items, title }) => (
  <li>
    {title && <div className="text-xs font-semibold leading-6 text-white">{title}</div>}
    <ul className="-mx-2 mt-2 space-y-1">
      {items.map((item) => <NavItemComponent key={item.name} item={item} />)}
    </ul>
  </li>
);