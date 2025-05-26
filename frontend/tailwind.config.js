/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF9232',
          DEFAULT: '#FF7E1B',
          dark: '#E86A00',
        },
        secondary: {
          light: '#4A4A4A',
          DEFAULT: '#323232',
          dark: '#1F1F1F',
        },
        accent: {
          light: '#F5F5F5',
          DEFAULT: '#E5E5E5',
          dark: '#CCCCCC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [],
};