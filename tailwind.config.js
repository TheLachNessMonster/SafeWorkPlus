/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0ea5e9',
        },
        danger: {
          500: '#ef4444',
        },
        warning: {
          500: '#f59e0b',
        },
        success: {
          500: '#22c55e',
        },
      },
    },
  },
  plugins: [],
}