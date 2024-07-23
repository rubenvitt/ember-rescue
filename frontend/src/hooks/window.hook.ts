import { getCurrent, LogicalSize } from '@tauri-apps/api/window';
import { useEffect } from 'react';

export const useWindowSetup = ({
                                 alwaysOnTop = false,
                                 center = false,
                                 size,
                                 fullscreen = false,
                                 resizable = true,
                                 title,
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
      const window = getCurrent();
      if (title !== undefined) await window.setTitle(title);
      if (fullscreen !== undefined) await window.setFullscreen(fullscreen);
      if (size !== undefined) await window.setSize(size);
      if (center !== undefined) await window.center();
      if (alwaysOnTop !== undefined) await window.setAlwaysOnTop(alwaysOnTop);
      if (resizable !== undefined) await window.setResizable(resizable);
    };
    setupWindow();
  }, []);
};