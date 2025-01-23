import React from 'react';
import { MobileSidebarComponent } from '../organisms/sidebar/MobileSidebar.component.js';
import { SidebarComponentProps } from '../../../types/ui/nav.types.js';
import { DesktopSidebarComponent } from '../organisms/sidebar/DesktopSidebar.component.js';
import { _useTheme } from '../../../hooks/theme.hook.js';
import { ConfigProvider, theme } from 'antd';

export const SidebarComponent: React.FC<SidebarComponentProps> = ({
                                                                    sidebarOpen,
                                                                    setSidebarOpen,
                                                                    isCollapsed,
                                                                    setIsCollapsed,
                                                                  }) => {
  const themeUtils = _useTheme();
  return (
    <ConfigProvider
      theme={{
        algorithm: themeUtils.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Menu: isCollapsed ? {
            colorSplit: 'transparent',
            groupTitleColor: 'rgba(255, 255, 255, 0.6)',
            itemSelectedColor: 'var(--color-primary-100)',
            itemSelectedBg: 'var(--color-primary-800)',
            itemColor: 'white',
            popupBg: themeUtils.isDark ? 'var(--color-primary-950)' : 'var(--color-primary-800)',
            itemHoverColor: 'var(--color-primary-300)',
          } : {
            colorSplit: 'transparent',
            groupTitleColor: 'rgba(255, 255, 255, 0.6)',
            itemSelectedColor: 'var(--color-primary-100)',
            itemSelectedBg: 'var(--color-primary-800)',
            itemColor: 'white',
            itemHoverColor: 'var(--color-primary-300)',
          },
        },
      }}
    >
      <MobileSidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <DesktopSidebarComponent setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
    </ConfigProvider>
  );
};
