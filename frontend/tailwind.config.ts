// @ts-ignore
import colors from 'tailwindcss/colors';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        primary: colors.sky,
      },
    },
  },
} satisfies Config;

