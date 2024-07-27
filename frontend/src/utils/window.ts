import { AppWindowOptions } from '../hooks/window.hook.js';

export enum Windows {
  MAIN = 'main',
  SIGN_IN = 'signin',
  APP = 'app',
  ADMIN = 'admin',
}


export const WindowUrls: { [key in Windows]: string } = {
  [Windows.MAIN]: '/',
  [Windows.SIGN_IN]: '/signin',
  [Windows.APP]: '/app',
  [Windows.ADMIN]: '/admin',
};

export const WindowOptions: { [key in Windows]: AppWindowOptions } = {
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
    fullscreen: true,
    resizable: true,
    title: 'Project Rescue',
  },
  [Windows.ADMIN]: {
    title: 'Project Rescue • Admin-Tools',
    center: true,
    maximizable: false,
    minimizable: false,
  },
};