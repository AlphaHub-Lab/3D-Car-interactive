/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F4F6F5',
        'bg-highlight': '#FFFFFF',
        'bg-secondary': '#E5EAE8',
        'bg-panel': '#E5EAE8',
        'floor': '#D8DEDC',
        'carbon': '#151A1C',
        'accent-teal': '#00A99D',
        'accent-teal-bright': '#2BE7D6',
        'accent-teal-dim': '#008279',
        'accent-teal-glow': 'rgba(43, 231, 214, 0.30)',
        'text-primary': '#111719',
        'text-secondary': '#5E686B',
        'line-charcoal': 'rgba(17, 23, 25, 0.38)',
        'border-subtle': 'rgba(17, 23, 25, 0.12)',
        'danger-red': '#c0392b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'f1-tracking': '0.08em',
      },
      boxShadow: {
        'teal-glow': '0 0 20px rgba(43, 231, 214, 0.45)',
        'teal-glow-lg': '0 0 35px rgba(43, 231, 214, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanLine 1.5s ease-out forwards',
      },
      keyframes: {
        scanLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      }
    },
  },
  plugins: [],
}
