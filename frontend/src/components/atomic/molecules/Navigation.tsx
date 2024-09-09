import { UseNavigateResult } from '@tanstack/react-router';
import { MenuItem } from '../../../types/ui/menu.types.js';
import {
  PiAmbulance,
  PiChartPie,
  PiChecks,
  PiClipboardText,
  PiClock,
  PiClockClockwise,
  PiCloud,
  PiDrone,
  PiFirstAid,
  PiGauge,
  PiInfo,
  PiMapTrifold,
  PiNotebook,
  PiPlus,
  PiUsers,
  PiWarningDiamond,
  PiWrench,
} from 'react-icons/pi';

export function navigation(navigate: UseNavigateResult<string>): MenuItem[] {
  return [
    {
      type: 'item',
      key: '/app',
      label: 'Dashboard',
      icon: <PiGauge size={24} />,
      onClick: () => navigate({ to: '/app' }),
    },
    {
      type: 'group',
      label: 'Einsatz',
      children: [
        {
          type: 'item',
          key: '/app/einsatztagebuch',
          label: 'Einsatztagebuch',
          icon: <PiNotebook size={24} />,
          onClick: () => navigate({ to: '/app/einsatztagebuch' }),
        },
        {
          type: 'item',
          key: '/app/einheiten',
          label: 'Einheiten',
          icon: <PiAmbulance size={24} />,
          onClick: () => navigate({ to: '/app/einheiten' }),
        },
        {
          type: 'submenu',
          key: 'betroffene',
          label: 'Betroffene & Patienten',
          icon: <PiFirstAid size={24} />,
          children: [
            {
              type: 'item',
              key: '/app/betroffene',
              label: 'Übersicht',
              icon: <PiFirstAid size={24} />,
              onClick: () => navigate({ to: '/app/betroffene' }),
            },
            {
              type: 'item',
              key: '/app/betroffene/aufnehmen',
              label: 'Aufnehmen',
              icon: <PiPlus size={24} />,
              onClick: () => navigate({ to: '/app/betroffene/aufnehmen' }),
            },
            {
              type: 'item',
              key: '/app/betroffene/verwalten',
              label: 'Verwalten',
              icon: <PiUsers size={24} />,
              onClick: () => navigate({ to: '/app/betroffene/verwalten' }),
            },
          ],
        },
        {
          type: 'submenu',
          key: 'anforderungen',
          label: 'Anforderungen',
          icon: <PiClipboardText size={24} />,
          children: [
            {
              type: 'item',
              key: '/app/anforderungen',
              label: 'Übersicht',
              icon: <PiClipboardText size={24} />,
              onClick: () => navigate({ to: '/app/anforderungen' }),
            },
            {
              type: 'item',
              key: '/app/anforderungen/neu',
              label: 'Neue Anforderung',
              icon: <PiPlus size={24} />,
              onClick: () => navigate({ to: '/app/anforderungen/neu' }),
            },
            {
              type: 'item',
              key: '/app/anforderungen/verlauf',
              label: 'Anforderungsverlauf',
              icon: <PiClockClockwise size={24} />,
              onClick: () => navigate({ to: '/app/anforderungen/verlauf' }),
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      label: 'Lageübersicht',
      children: [
        {
          type: 'submenu',
          key: 'lagekarte',
          label: 'Lagekarte',
          icon: <PiMapTrifold size={24} />,
          children: [
            {
              type: 'item',
              key: '/app/lagekarte',
              label: 'Lagekarte Übersicht',
              icon: <PiMapTrifold size={24} />,
              onClick: () => navigate({ to: '/app/lagekarte' }),
            },
            {
              type: 'item',
              key: '/app/lagekarte/letzte-eintraege',
              label: 'Letzte Einträge',
              icon: <PiClock size={24} />,
              onClick: () => navigate({ to: '/app/lagekarte/letzte-eintraege' }),
            },
            {
              type: 'item',
              key: '/app/lagekarte/dwd-wetterkarte',
              label: 'DWD Wetterkarte',
              icon: <PiCloud size={24} />,
              onClick: () => navigate({ to: '/app/lagekarte/dwd-wetterkarte' }),
            },
          ],
        },
        {
          type: 'item',
          key: '/app/uav',
          label: 'UAV',
          icon: <PiDrone size={24} />,
          onClick: () => navigate({ to: '/app/uav' }),
        },
      ],
    },
    {
      type: 'group',
      label: 'Einsatzinformationen',
      children: [
        {
          type: 'item',
          key: '/app/einsatzdaten',
          label: 'Einsatzdaten',
          icon: <PiInfo size={24} />,
          onClick: () => navigate({ to: '/app/einsatzdaten' }),
        },
        {
          type: 'item',
          key: '/app/einsatzabschnitte',
          label: 'Einsatzabschnitte',
          icon: <PiChartPie size={24} />,
          onClick: () => navigate({ to: '/app/einsatzabschnitte' }),
        },
        {
          type: 'submenu',
          key: 'schaden',
          label: 'Schäden',
          icon: <PiWrench size={24} />,
          children: [
            {
              type: 'item',
              key: '/app/schaden',
              label: 'Schäden Übersicht',
              icon: <PiWrench size={24} />,
              onClick: () => navigate({ to: '/app/schaden' }),
            },
            {
              type: 'item',
              key: '/app/schaden/personenschaden',
              label: 'Personenschaden',
              icon: <PiPlus size={24} />,
              onClick: () => navigate({ to: '/app/schaden/personenschaden' }),
            },
            {
              type: 'item',
              key: '/app/schaden/sachschaden',
              label: 'Sachschaden',
              icon: <PiUsers size={24} />,
              onClick: () => navigate({ to: '/app/schaden/sachschaden' }),
            },
          ],
        },
        {
          type: 'item',
          key: '/app/gefahren',
          label: 'Gefahren',
          icon: <PiWarningDiamond size={24} />,
          onClick: () => navigate({ to: '/app/gefahren' }),
        },
      ],
    },
    {
      type: 'item',
      key: '/app/notizen',
      label: 'Notizen & Erinnerungen',
      icon: <PiChecks size={24} />,
      onClick: () => navigate({ to: '/app/notizen' }),
    },
  ];
}