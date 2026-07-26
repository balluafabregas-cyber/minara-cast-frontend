import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8ec', 100: '#faeec9', 200: '#f4dc93', 300: '#edc55c',
          400: '#e6b136', 500: '#d4af37', 600: '#b3891f', 700: '#8f691b',
          800: '#77551c', 900: '#66471d',
        },
        emerald: {
          50: '#eafaf3', 100: '#cdf2e1', 200: '#9de5c8', 300: '#65cfab',
          400: '#38b58e', 500: '#0b6e4f', 600: '#0a5e44', 700: '#0b4b38',
          800: '#0c3c2e', 900: '#0b3227',
        },
        navy: {
          50: '#eef1f8', 100: '#d3daee', 200: '#a7b6dd', 300: '#7a92cb',
          400: '#4f6db8', 500: '#2f4d94', 600: '#1e3873', 700: '#16294f',
          800: '#0f1c37', 900: '#080f1f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      backgroundImage: {
        'islamic-pattern': "url('/patterns/islamic-pattern.svg')",
        'hero-gradient': 'linear-gradient(135deg, #0b3227 0%, #16294f 50%, #0b3227 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
