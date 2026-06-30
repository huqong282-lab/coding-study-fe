/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--bg)',
          muted: 'var(--surface-muted)',
          elevated: 'var(--surface-elevated)',
        },
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          heading: 'var(--text-h)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-bg)',
          border: 'var(--accent-border)',
        },
      },
      fontFamily: {
        sans: ['var(--sans)'],
        heading: ['var(--heading)'],
        mono: ['var(--mono)'],
      },
      boxShadow: {
        soft: 'var(--shadow)',
      },
      borderRadius: {
        button: 'var(--radius-button)',
        surface: 'var(--radius-surface)',
      },
    },
  },
  plugins: [],
}
