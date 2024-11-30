/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideRight: 'slideRight 0.3s',
      },
    },
  },
  plugins: [],
}

