import React, { useMemo } from 'react';
import { SidebarContentProps } from '../../../../types/ui/nav.types.js';
import { EinsatzInfoComponent } from '../../molecules/EinsatzInfo.component.js';
import { WindowOptions, Windows } from '../../../../utils/window.js';
import {
  PiAmbulance,
  PiChartPie,
  PiChecks,
  PiClock,
  PiCloud,
  PiDrone,
  PiFadersHorizontal,
  PiFirstAid,
  PiGauge,
  PiInfo,
  PiMapTrifold,
  PiNotebook,
  PiPlus,
  PiQuestion,
  PiUsers,
  PiWarningDiamond,
  PiWrench,
} from 'react-icons/pi';
import { useAppWindow } from '../../../../hooks/window.hook.js';
import { MenuItem } from '../../../../types/ui/menu.types.ts';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { ConfigProvider, Menu, theme } from 'antd';
import { twConfig } from '../../../../styles/tailwindcss.styles.js';
import { _useTheme } from '../../../../hooks/theme.hook.js';

const tempNavigation: MenuItem[] = [
  {
    key: '/app',
    label: 'Dashboard',
    icon: <PiGauge size={24} />,
  },
  {
    key: '/app/einsatztagebuch',
    label: 'Einsatztagebuch',
    icon: <PiNotebook size={24} />,
  },
  {
    key: '/app/einheiten',
    label: 'Einheiten',
    icon: <PiAmbulance size={24} />,
  },
  {
    key: '/app/betroffene',
    label: 'Betroffene & Patienten',
    icon: <PiFirstAid size={24} />,
    children: [
      {
        key: '/app/betroffene#aufnehmen',
        icon: <PiPlus size={24} />,
        label: 'Aufnehmen',
      },
      {
        key: '/app/betroffene#verwalten',
        icon: <PiUsers size={24} />,
        label: 'Verwalten',
      },
    ],
  },
  {
    key: '/app/lagekarte',
    label: 'Lagekarte',
    icon: <PiMapTrifold size={24} />,

    children: [
      {
        key: '/app/lagekarte#letzte-eintraege',
        label: 'Letzte Einträge',
        icon: <PiClock size={24} />,
      },
      {
        key: '/app/lagekarte#dwd-wetterkarte',
        label: 'DWD Wetterkarte',
        icon: <PiCloud size={24} />,
      },
    ],
  },
  {
    key: '/app/uav',
    label: 'Drohne',
    icon: <PiDrone size={24} />,
  },
  {
    key: '/app/einsatzdaten',
    label: 'Einsatzdaten',
    icon: <PiInfo size={24} />,
  },
  {
    key: '#',
    label: '(?) Einsatzabschnitte',
    icon: <PiChartPie size={24} />,
  },
  {
    key: '/app/schaden',
    label: '(?) Schäden',
    icon: <PiWrench size={24} />,

    children: [
      {
        key: '/app/schaden#personenschaden',
        label: 'Personenschaden',
        icon: <PiPlus size={24} />,
      },
      {
        key: '/app/schaden#sachschaden',
        label: 'Sachschaden',
        icon: <PiUsers size={24} />,
      },
    ],
  },
  {
    key: '/app/gefahren',
    label: '(?) Gefahren',
    icon: <PiWarningDiamond size={24} />,
  },
  {
    key: '/app/notizen',
    label: 'Notizen & Erinnerungen',
    icon: <PiChecks size={24} />,
  },
];

export const SidebarContentComponent: React.FC<SidebarContentProps> = () => {
  const openAdmin = useAppWindow({ appWindow: Windows.ADMIN, windowOptions: WindowOptions.admin });
  const openDocs = useAppWindow({ appWindow: Windows.DOCS, windowOptions: WindowOptions.docs });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const themeUtils = _useTheme();

  const navItems = useMemo<MenuItem[]>(() => {
    return tempNavigation.map(((item: MenuItem) => ({
      onClick: async () => {
        await navigate({ to: item!.key });
      },
      ...item,
    } as MenuItem)));
  }, []);

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
              key: '/admin',
              label: 'Admin Center',
              icon: <PiFadersHorizontal size={24} />,
              onClick: () => openAdmin(),
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