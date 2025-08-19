/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{pug,html,js}',
    './docs/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        // Japanese traditional colors from the project
        'shu-primary': '#FF3500',
        'enji-secondary': '#C93338',
        'sango-accent': '#F8674F',
        'shu-muted': '#E34234',
        'enji-deep': '#B91C1C',
        'sango-light': '#F87171',
        // Dark theme colors
        'dark-primary': '#0F0F23',
        'dark-secondary': '#1E1E2E',
        'dark-surface': '#313244',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
      },
      spacing: {
        // Japanese Ma (negative space) patterns
        'ma-sm': '16px',
        'ma-md': '24px',
        'ma-lg': '32px',
        'ma-xl': '48px',
        'ma-2xl': '64px',
        'ma-3xl': '80px',
        'ma-hero': '120px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'japanese': '0 4px 16px rgba(255, 53, 0, 0.1)',
        'japanese-hover': '0 8px 24px rgba(255, 53, 0, 0.15)',
        'japanese-active': '0 2px 8px rgba(255, 53, 0, 0.2)',
      },
      borderRadius: {
        'japanese': '8px',
      },
    },
  },
  plugins: [],
}