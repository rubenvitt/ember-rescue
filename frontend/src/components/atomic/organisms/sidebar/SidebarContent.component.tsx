import React, { useMemo } from 'react';
import { SidebarContentProps } from '../../../../types/ui/nav.types.js';
import { EinsatzInfoComponent } from '../../molecules/EinsatzInfo.component.js';
import { WindowOptions, Windows } from '../../../../utils/window.js';
import { PiFadersHorizontal, PiQuestion } from 'react-icons/pi';
import { useAppWindow } from '../../../../hooks/window.hook.js';
import { MenuItem } from '../../../../types/ui/menu.types.ts';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { ConfigProvider, Menu } from 'antd';
import { navigation } from '../../molecules/Navigation.js';

export const SidebarContentComponent: React.FC<SidebarContentProps & {
  isCollapsed?: boolean
}> = ({ isCollapsed = false }) => {
  const openAdmin = useAppWindow({ appWindow: Windows.ADMIN, windowOptions: WindowOptions.admin });
  const openDocs = useAppWindow({ appWindow: Windows.DOCS, windowOptions: WindowOptions.docs });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = useMemo<MenuItem[]>(() => {
    return navigation(navigate).map(
      (item: MenuItem) =>
        ({
          onClick: async () => {
            await navigate({ to: item!.key });
          },
          ...item,
          // @ts-ignore its... complicated 🫣
          label: isCollapsed ? null : item.label, // Hide label when collapsed
          // @ts-ignore its... complicated 🫣
          icon: item.icon ? React.cloneElement(item.icon as React.ReactElement, { size: isCollapsed ? 24 : 20 }) : null,
        }) as MenuItem,
    );
  }, [navigate, isCollapsed]);

  const menuStyle = {
    backgroundColor: 'transparent',
  };

  return (
    <>
      <ConfigProvider
        theme={{
          // ... (theme configuration remains the same)
          components: {
            Menu: {
              // ... (existing Menu theme configuration)
              itemHeight: 48,
              itemMarginInline: 0,
              subMenuItemBg: 'transparent',
            },
          },
        }}
      >
        <div className={`flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 pb-4 dark:bg-primary-950 ${
          isCollapsed ? 'items-center' : ''
        }`}>
          <div className={isCollapsed ? 'hidden' : 'px-6 py-4'}>
            <EinsatzInfoComponent />
          </div>
          <Menu
            selectedKeys={[pathname]}
            mode="inline"
            items={navItems}
            inlineCollapsed={isCollapsed}
            style={menuStyle}
            className={`border-none ${isCollapsed ? 'w-full' : ''}`}
          />
          <Menu
            className={`mt-auto border-none ${isCollapsed ? 'w-full' : ''}`}
            selectedKeys={[pathname]}
            mode="inline"
            inlineCollapsed={isCollapsed}
            style={menuStyle}
            items={[
              {
                type: 'submenu',
                key: '/admin',
                label: isCollapsed ? null : 'Administration',
                icon: <PiFadersHorizontal size={24} />,
                children: [
                  {
                    key: '/admin-center',
                    danger: true,
                    label: isCollapsed ? null : 'Admin Center',
                    icon: <PiFadersHorizontal size={24} />,
                    onClick: () => openAdmin(),
                  },
                ],
              },
              {
                key: '/help',
                label: isCollapsed ? null : 'Support',
                icon: <PiQuestion size={24} />,
                onClick: () => openDocs(),
              },
            ]}
          />
        </div>
      </ConfigProvider>
    </>
  );
};