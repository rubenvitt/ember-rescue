import { AppWindowOptions } from '../hooks/window.hook.js';
import { LogicalSize } from '@tauri-apps/api/window';

export enum Windows {
  MAIN = 'main',
  APP = 'app',
  ADMIN = 'admin',
  DOCS = 'docs',
}

export const WindowUrls: Readonly<Record<Windows, string>> = {
  [Windows.MAIN]: '/signin',
  [Windows.APP]: '/app',
  [Windows.ADMIN]: '/admin',
  [Windows.DOCS]:
    process.env.NODE_ENV !== 'development' ? 'http://localhost:3001' : 'https://project-rescue-docs.vercel.app',
};

export const WindowOptions: Readonly<Record<Windows, AppWindowOptions & { size?: LogicalSize }>> = {
  [Windows.MAIN]: {
    title: 'Project Rescue • Anmelden',
    center: true,
    maximizable: false,
    minimizable: false,
    width: 400,
    height: 600,
    size: new LogicalSize(400, 600),
    resizable: false,
    alwaysOnTop: process.env.NODE_ENV !== 'development',
  },
  [Windows.APP]: {
    fullscreen: process.env.NODE_ENV !== 'development',
    width: 1600,
    height: 1200,
    resizable: true,
    title: 'Project Rescue',
  },
  [Windows.ADMIN]: {
    title: 'Project Rescue • Admin-Tools',
    center: true,
    maximizable: false,
    minimizable: false,
  },
  [Windows.DOCS]: {
    title: 'Project Rescue • Dokumentation',
    center: true,
    maximizable: true,
    minimizable: false,
    alwaysOnTop: true,
    resizable: true,
    width: 1200,
    height: 800,
  },
};
