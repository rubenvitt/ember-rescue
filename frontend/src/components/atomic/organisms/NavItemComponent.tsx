import React from 'react';
import { Link } from '../atoms/Link.js';
import { navItemStyles } from '../../../styles/nav.styles.js';
import { NavItemProps } from '../../../types/nav.types.js';

export const NavItemComponent: React.FC<NavItemProps> = ({ item }) => (
  <li key={item.name}>
    <Link to={item.href} className={navItemStyles({ current: item.current })}>
      {'icon' in item && item.icon && <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />}
      {item.name}
    </Link>
  </li>
);