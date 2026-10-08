/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          chassis: '#e0e5ec',
          panel: '#f0f2f5',
          recess: '#d1d9e6',
          ink: '#2d3436',
          muted: '#4a5568',
          accent: '#ff4757',
          border: '#babecc',
          deep: '#a3b1c6',
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
      }
    },
    boxShadow: {
      'industrial-card': '6px 6px 12px #babecc, -6px -6px 12px #ffffff',
      'industrial-floating': '9px 9px 18px #babecc, -9px -9px 18px #ffffff, inset 1px 1px 0 rgb(255 255 255 / 50%)',
      'industrial-pressed': 'inset 4px 4px 8px #babecc, inset -4px -4px 8px #ffffff',
      'industrial-recessed': 'inset 3px 3px 6px #babecc, inset -3px -3px 6px #ffffff',
    },
  },
  plugins: [],
}
