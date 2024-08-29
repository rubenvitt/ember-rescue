import React from 'react';
import { MobileSidebarComponent } from '../organisms/sidebar/MobileSidebar.component.js';
import { SidebarComponentProps } from '../../../types/ui/nav.types.js';
import { DesktopSidebarComponent } from '../organisms/sidebar/DesktopSidebar.component.js';

export const SidebarComponent: React.FC<SidebarComponentProps> = ({
                                                                    sidebarOpen,
                                                                    setSidebarOpen,
                                                                  }) => {
  return (
    <>
      <MobileSidebarComponent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <DesktopSidebarComponent />
    </>
  );
};