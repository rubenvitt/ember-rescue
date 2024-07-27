import React, { useMemo } from 'react';
import { useLocation } from '@tanstack/react-router';
import { MobileSidebarComponent } from '../organisms/sidebar/MobileSidebar.component.js';
import { SidebarComponentProps } from '../../../types/ui/nav.types.js';
import { DesktopSidebarComponent } from '../organisms/sidebar/DesktopSidebar.component.js';

export const SidebarComponent: React.FC<SidebarComponentProps> = ({
                                                                    sidebarOpen,
                                                                    setSidebarOpen,
                                                                    navigation: _navigation,
                                                                    contextualNavigation,
                                                                  }) => {
  const { pathname } = useLocation();
  const navigation = useMemo(() =>
      _navigation.map(item => ({ ...item, current: item.href === pathname })),
    [_navigation, pathname],
  );

  return (
    <>
      <MobileSidebarComponent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        contextualNavigation={contextualNavigation}
      />
      <DesktopSidebarComponent navigation={navigation} contextualNavigation={contextualNavigation} />
    </>
  );
};