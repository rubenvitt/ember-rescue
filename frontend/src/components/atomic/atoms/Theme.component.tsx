import { _useTheme } from '../../../hooks/theme.hook.js';
import { createContext, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import deDE from 'antd/locale/de_DE.js';

export const ThemeContext = createContext<ReturnType<typeof _useTheme> | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeUtils = _useTheme();

  return (
    <ThemeContext.Provider value={themeUtils}>
      <ConfigProvider locale={deDE}
                      theme={{ algorithm: themeUtils.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}