/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'float-up': {
          '0%': {
            transform: 'translateY(0) scale(0.5)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(-100px) scale(1.5)',
            opacity: '0'
          }
        }
      },
      animation: {
        'float-up': 'float-up 1.5s ease-out forwards'
      }
    }
  },
  plugins: [],
};
