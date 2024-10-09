import React from 'react';
import { MobileSidebarComponent } from '../organisms/sidebar/MobileSidebar.component.js';
import { SidebarComponentProps } from '../../../types/ui/nav.types.js';
import { DesktopSidebarComponent } from '../organisms/sidebar/DesktopSidebar.component.js';
import { _useTheme } from '../../../hooks/theme.hook.js';
import { ConfigProvider, theme } from 'antd';
import { twConfig } from '../../../styles/tailwindcss.styles.js';

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
            itemSelectedColor: twConfig.theme.colors.primary[100],
            itemSelectedBg: twConfig.theme.colors.primary[800],
            itemColor: 'white',
            popupBg: themeUtils.isDark ? twConfig.theme.colors.primary[950] : twConfig.theme.colors.primary[800],
            itemHoverColor: twConfig.theme.colors.primary[300],
          } : {
            colorSplit: 'transparent',
            groupTitleColor: 'rgba(255, 255, 255, 0.6)',
            itemSelectedColor: twConfig.theme.colors.primary[100],
            itemSelectedBg: twConfig.theme.colors.primary[800],
            itemColor: 'white',
            itemHoverColor: twConfig.theme.colors.primary[300],
          },
        },
      }}
    >
      <MobileSidebarComponent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <DesktopSidebarComponent setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
    </ConfigProvider>
  );
};
