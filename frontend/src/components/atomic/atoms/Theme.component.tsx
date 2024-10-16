import { _useTheme } from '../../../hooks/theme.hook.js';
import { createContext, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import deDE from 'antd/locale/de_DE.js';
import { natoDateTimeAnt } from '../../../utils/time.js';

export const ThemeContext = createContext<ReturnType<typeof _useTheme> | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeUtils = _useTheme();

  console.log('deDE is', deDE);

  return (
    <ThemeContext.Provider value={themeUtils}>
      <ConfigProvider
        // @ts-ignore
        locale={{
          ...deDE,
          Calendar: {
            // @ts-ignore
            ...deDE.Calendar,
            dateTimeFormat: natoDateTimeAnt,
            fieldDateTimeFormat: natoDateTimeAnt,
          },
          DatePicker: {
            // @ts-ignore
            ...deDE.DatePicker,
            lang: {
              // @ts-ignore
              ...deDE.DatePicker.lang,
              dateTimeFormat: natoDateTimeAnt,
              fieldDateTimeFormat: natoDateTimeAnt,
            },
          },
        }}
        theme={{
          algorithm: themeUtils.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
