import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        evzone: {
          green: '#03cd8c',
          orange: '#f77f00',
          medium: '#a6a6a6',
          light: '#f2f2f2',
          ink: '#0f172a',
        },
      },
      boxShadow: {
        evz: '0 18px 46px rgba(15, 23, 42, 0.09)',
        'evz-lg': '0 30px 80px rgba(15, 23, 42, 0.12)',
      },
      borderRadius: {
        evz: '28px',
      },
    },
  },
  plugins: [],
} satisfies Config;
