import { _useTheme } from '../../../hooks/theme.hook';
import { createContext, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import deDE from 'antd/locale/de_DE.js';
import { natoDateTimeAnt } from '../../../utils/time';
import { twConfig } from '../../../styles/tailwindcss.styles';

export const ThemeContext = createContext<ReturnType<typeof _useTheme> | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeUtils = _useTheme();

  return (
    <ThemeContext.Provider value={themeUtils}>
      <ConfigProvider
        // @ts-ignore
        locale={{
          ...deDE,
          DatePicker: {
            // @ts-ignore
            ...deDE.DatePicker,
            lang: {
              // @ts-ignore
              ...deDE.DatePicker.lang,
              dateTimeFormat: natoDateTimeAnt,
              fieldDateTimeFormat: natoDateTimeAnt,
            },
            RangePicker: {
              // @ts-ignore
              ...deDE.DatePicker.RangePicker,
              lang: {
                // @ts-ignore
                ...deDE.DatePicker.Rangepicker.lang,
                dateTimeFormat: natoDateTimeAnt,
                fieldDateTimeFormat: natoDateTimeAnt,
              },
            },
          },
        }}
        theme={{
          algorithm: themeUtils.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          components: {
            Menu: {
              colorSplit: 'transparent',
              groupTitleColor: 'rgba(255, 255, 255, 0.6)',
              itemSelectedColor: twConfig.theme.colors.primary[600],
              itemColor: 'white',
              itemHoverColor: twConfig.theme.colors.primary[300],
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
