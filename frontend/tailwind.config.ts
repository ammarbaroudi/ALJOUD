import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3D1C0E',
        secondary: '#6B3A2A',
        cream: '#F5EDD8',
        light: '#FAF6EE',
      },
    },
  },
  plugins: [],
} satisfies Config
