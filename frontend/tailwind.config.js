import colors from 'tailwindcss/colors';
import generated from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'selector',
  plugins: [generated],
  theme: {
    extend: {
      colors: {
        primary: colors.orange,
      },
    },
  },
};

