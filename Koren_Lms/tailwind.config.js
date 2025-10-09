/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        korean: {
          50: '#fef7ee',
          100: '#fdedd7',
          200: '#fad7ae',
          300: '#f7ba7a',
          400: '#f39344',
          500: '#f0731e',
          600: '#e15714',
          700: '#bb4113',
          800: '#953318',
          900: '#782c17',
        }
      },
      fontFamily: {
        'korean': ['Noto Sans KR', 'sans-serif'],
      }
    },
  },
  plugins: [],
}