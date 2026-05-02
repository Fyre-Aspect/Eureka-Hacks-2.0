import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#1B7A6E',
        accent: '#F5A623',
        error: '#D94E4E',
        surface: '#FAFAF8',
        'text-main': '#1A1A1A',
        subtle: '#8C8C8C',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: {
        lumi: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.03)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-20deg)' },
          '40%': { transform: 'rotate(20deg)' },
          '60%': { transform: 'rotate(-15deg)' },
          '80%': { transform: 'rotate(15deg)' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(12deg)' },
        },
        bounce_lumi: {
          '0%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-12px)' },
          '60%': { transform: 'translateY(-6px)' },
        },
        nod: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(4px)' },
          '75%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        breathe: 'breathe 3s ease-in-out infinite',
        wave: 'wave 1s ease-in-out',
        tilt: 'tilt 0.6s ease-in-out',
        bounce_lumi: 'bounce_lumi 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        nod: 'nod 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
} satisfies Config
