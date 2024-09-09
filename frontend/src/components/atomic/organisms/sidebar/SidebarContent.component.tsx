import React, { useMemo } from 'react';
import { SidebarContentProps } from '../../../../types/ui/nav.types.js';
import { EinsatzInfoComponent } from '../../molecules/EinsatzInfo.component.js';
import { WindowOptions, Windows } from '../../../../utils/window.js';
import { PiFadersHorizontal, PiQuestion } from 'react-icons/pi';
import { useAppWindow } from '../../../../hooks/window.hook.js';
import { MenuItem } from '../../../../types/ui/menu.types.ts';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { ConfigProvider, Menu, theme } from 'antd';
import { twConfig } from '../../../../styles/tailwindcss.styles.js';
import { _useTheme } from '../../../../hooks/theme.hook.js';
import { navigation } from '../../molecules/Navigation.js';

export const SidebarContentComponent: React.FC<SidebarContentProps> = () => {
  const openAdmin = useAppWindow({ appWindow: Windows.ADMIN, windowOptions: WindowOptions.admin });
  const openDocs = useAppWindow({ appWindow: Windows.DOCS, windowOptions: WindowOptions.docs });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const themeUtils = _useTheme();

  const navItems = useMemo<MenuItem[]>(() => {
    return navigation(navigate).map(((item: MenuItem) => ({
      onClick: async () => {
        await navigate({ to: item!.key });
      },
      ...item,
    } as MenuItem)));
  }, [navigate]);

  return (
    <>
      <ConfigProvider theme={{
        algorithm: themeUtils.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Menu:
            themeUtils.isDark ? {
              itemBg: twConfig.theme.colors.primary['950'],
              darkItemColor: twConfig.theme.colors.white,
              itemHoverBg: twConfig.theme.colors.primary['600'],
              itemSelectedBg: twConfig.theme.colors.primary['800'],
              itemSelectedColor: twConfig.theme.colors.white,
            } : {
              itemBg: twConfig.theme.colors.primary['600'],
              itemColor: twConfig.theme.colors.white,
              itemHoverBg: twConfig.theme.colors.primary['200'],
              itemSelectedBg: twConfig.theme.colors.white,
              itemSelectedColor: twConfig.theme.colors.primary['600'],
            },
        },
      }}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 dark:bg-primary-950 pb-4">
          <div className="px-6">
            <EinsatzInfoComponent />
          </div>
          <Menu selectedKeys={[pathname]} mode="inline" items={navItems} />
          <Menu className="mt-auto" selectedKeys={[pathname]} mode="inline" items={[
            {
              type: 'submenu',
              key: '/admin',
              label: 'Administration',
              children: [
                {
                  key: '/admin-center',
                  danger: true,
                  label: 'Admin Center',
                  icon: <PiFadersHorizontal size={24} />,
                  onClick: () => openAdmin(),
                },
              ],
            },
            {
              key: '/help',
              label: 'Support',
              icon: <PiQuestion size={24} />,
              onClick: () => openDocs(),
            },
          ]} />
        </div>
      </ConfigProvider>
    </>
  );
};