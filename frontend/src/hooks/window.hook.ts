import { getCurrentWindow, LogicalSize, type WindowOptions } from '@tauri-apps/api/window';
import { useCallback, useEffect } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { Windows, WindowUrls } from '../utils/window.js';
import { useNavigate } from '@tanstack/react-router';
import { getCurrentWebviewWindow, WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { WebviewOptions } from '@tauri-apps/api/webview';

export const useWindowSetup = ({
  title,
  fullscreen = false,
  size,
  center = false,
  alwaysOnTop = false,
  resizable = true,
}: {
  title?: string;
  fullscreen?: boolean;
  size?: LogicalSize;
  center?: boolean;
  alwaysOnTop?: boolean;
  resizable?: boolean;
}) => {
  useEffect(() => {
    const setupWindow = async () => {
      try {
        const window = getCurrentWindow();
        if (title !== undefined) await window.setTitle(title);
        if (fullscreen !== undefined) await window.setFullscreen(fullscreen);
        if (size !== undefined) await window.setSize(size);
        if (center) await window.center();
        if (alwaysOnTop !== undefined) await window.setAlwaysOnTop(alwaysOnTop);
        if (resizable !== undefined) await window.setResizable(resizable);
      } catch (error) {
        console.error('Failed to set up window:', error);
      }
    };
    if (isTauri()) {
      setupWindow();
    }
  }, [title, fullscreen, size, center, alwaysOnTop, resizable]);
};

export type AppWindowOptions = Omit<WebviewOptions, 'x' | 'y' | 'width' | 'height' | 'url'> & WindowOptions;

interface UseAppWindowParameters {
  appWindow: Windows;
  windowOptions?: AppWindowOptions;
}

export const useAppWindow = ({ appWindow, windowOptions }: UseAppWindowParameters) => {
  const browserNavigate = useNavigate();

  return useCallback(
    (props: { closeOnNavigate: boolean } = { closeOnNavigate: false }) => {
      const { closeOnNavigate } = props;
      if (isTauri() && getCurrentWebviewWindow().label !== appWindow) {
        const webviewWindow = new WebviewWindow(appWindow, {
          url: WindowUrls[appWindow],
          ...(windowOptions ? windowOptions : {}),
        });
        webviewWindow.once('tauri://created', () => {
          if (closeOnNavigate) {
            getCurrentWindow().close();
          }
        });
      } else {
        console.trace('not using tauri for window creation');
        if (WindowUrls[appWindow].startsWith('http')) {
          // navigate with browser api
          window.open(WindowUrls[appWindow]);
        } else {
          browserNavigate({ to: WindowUrls[appWindow] });
        }
      }
    },
    [browserNavigate, appWindow],
  );
};
