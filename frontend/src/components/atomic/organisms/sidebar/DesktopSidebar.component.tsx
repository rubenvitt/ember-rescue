import React from 'react';
import { DesktopSidebarProps } from '../../../../types/ui/nav.types.js';
import { SidebarContentComponent } from './SidebarContent.component.js';

export const DesktopSidebarComponent: React.FC<DesktopSidebarProps> = () => (
  <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <SidebarContentComponent />
  </div>
);