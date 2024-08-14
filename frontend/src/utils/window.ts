import { AppWindowOptions } from '../hooks/window.hook.js';

export enum Windows {
  MAIN = 'main',
  SIGN_IN = 'signin',
  APP = 'app',
  ADMIN = 'admin',
  DOCS = 'docs',
}


export const WindowUrls: Readonly<Record<Windows, string>> = {
  [Windows.MAIN]: '/',
  [Windows.SIGN_IN]: '/signin',
  [Windows.APP]: '/app',
  [Windows.ADMIN]: '/admin',
  [Windows.DOCS]: process.env.NODE_ENV !== 'development' ? 'http://localhost:3001' : 'https://project-rescue-docs.vercel.app',
};

export const WindowOptions: Readonly<Record<Windows, AppWindowOptions>> = {
  [Windows.MAIN]: {
    titleBarStyle: 'transparent',
    hiddenTitle: true,
    closable: false,
    width: 0,
    height: 0,
    focus: false,
    alwaysOnBottom: true,
    visible: false,
  },
  [Windows.SIGN_IN]: {
    title: 'Project Rescue • Anmelden',
    center: true,
    maximizable: false,
    minimizable: false,
    width: 400,
    height: 600,
    resizable: false,
    alwaysOnTop: true,
  },
  [Windows.APP]: {
    fullscreen: process.env.NODE_ENV !== 'development',
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