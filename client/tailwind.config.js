/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          background: '#f9f8f4',
          foreground: '#2d3a31',
          sage: '#8c9a84',
          clay: '#dccfc2',
          border: '#e6e2da',
          terracotta: '#c27b66',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      boxShadow: {
        'botanical-soft': '0 10px 24px rgb(45 58 49 / 6%)',
        'botanical-medium': '0 20px 40px -10px rgb(45 58 49 / 8%)',
      },
    },
  },
  plugins: [],
}
