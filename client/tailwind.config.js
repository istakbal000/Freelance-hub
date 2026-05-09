/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceDim: '#F1F5F9',
        surfaceBright: '#FFFFFF',
        primary: {
          DEFAULT: '#1E3A8A', // deep navy
          container: '#DBEAFE',
          on: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#0284C7', // sky blue
          container: '#E0F2FE',
          on: '#FFFFFF',
        },
        tertiary: {
          DEFAULT: '#059669', // emerald
          container: '#D1FAE5',
          on: '#FFFFFF',
        },
        error: {
          DEFAULT: '#DC2626', // red-600
          container: '#FEE2E2',
          on: '#FFFFFF',
        },
        borderSubtle: '#E2E8F0',
        glassFill: 'rgba(255, 255, 255, 0.7)',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 1s infinite',
        'float-delay2': 'float 3s ease-in-out 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
