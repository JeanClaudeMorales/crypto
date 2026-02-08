/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Now Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        white: '#FFFFFF',
        primary: {
          DEFAULT: '#7F66FF',
          dark: '#6344E5',
          light: '#9E8CFF',
          glow: 'rgba(127, 102, 255, 0.45)',
        },
        success: '#049F6C',
        blue: '#0950C3',
        bg: {
          main: '#0F111A',
          card: '#181B26',
          input: '#232634',
          lighter: '#1F2230',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        glow: '0 0 40px rgba(127, 102, 255, 0.18)',
        card: '0 10px 30px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'reverse-spin': { from: { transform: 'rotate(360deg)' }, to: { transform: 'rotate(0deg)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'reverse-spin': 'reverse-spin 12s linear infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      }
    },
  },
  plugins: [],
};
