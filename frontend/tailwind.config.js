/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: '#05060a',
          1: '#0a0c14',
          2: '#10131c',
          3: '#161a25',
        },
        gold: {
          DEFAULT: '#d4af37',
          50: '#fbf6e3',
          100: '#f3e8b8',
          200: '#eedb87',
          300: '#e8cd5d',
          400: '#e0bd3e',
          500: '#d4af37',
          600: '#a98826',
          700: '#7c621a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(212, 175, 55, 0.5)',
        card: '0 10px 30px -10px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(ellipse at top, rgba(212,175,55,0.10), transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
