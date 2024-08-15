import { _useTheme } from '../../../hooks/theme.hook.js';
import { createContext, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

export const ThemeContext = createContext<ReturnType<typeof _useTheme> | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeUtils = _useTheme();

  return (
    <ThemeContext.Provider value={themeUtils}>
      <ConfigProvider theme={{ algorithm: themeUtils.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}