/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#eefdfa',
          100: '#d3f8f0',
          200: '#aaefe2',
          300: '#73e0cf',
          400: '#3ec9b6',
          500: '#1aae9d',
          600: '#108b80',
          700: '#0f6f68',
          800: '#105955',
          900: '#0e4a47',
          950: '#032b2a',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dde2ea',
          300: '#bcc4d2',
          400: '#8b95a8',
          500: '#5d6776',
          600: '#3f4856',
          700: '#2c333e',
          800: '#1c222b',
          900: '#10141b',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,.04), 0 4px 16px rgba(16,24,40,.06)',
        ring: '0 0 0 6px rgba(26, 174, 157, 0.12)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at top, rgba(26,174,157,0.08), transparent 60%)',
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'fade-up': 'fadeUp .5s ease-out both',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.85', transform: 'scale(1.04)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wave: {
          '0%,100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};
