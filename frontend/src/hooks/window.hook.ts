import { getCurrent, LogicalSize } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export const useWindowSetup = ({
                                 title,
                                 fullscreen = false,
                                 size,
                                 center = false,
                                 alwaysOnTop = false,
                                 resizable = true,
                               }: {
  title: string,
  fullscreen?: boolean,
  size?: LogicalSize,
  center?: boolean,
  alwaysOnTop?: boolean,
  resizable?: boolean
}) => {
  useEffect(() => {
    const setupWindow = async () => {
      try {
        const window = getCurrent();
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
    setupWindow();
  }, [title, fullscreen, size, center, alwaysOnTop, resizable]);
};