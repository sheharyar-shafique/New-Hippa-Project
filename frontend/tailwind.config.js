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
        // NoteMD green — matches the logo
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
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
        ring: '0 0 0 6px rgba(34, 197, 94, 0.12)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 60%)',
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
