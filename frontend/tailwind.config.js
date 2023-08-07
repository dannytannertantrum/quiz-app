/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'thunder': {
          '50': '#f9f6f9',
          '100': '#f2ecf2',
          '200': '#e2d5e1',
          '300': '#c8b1c8',
          '400': '#aa86aa',
          '500': '#8f688f',
          '600': '#765375',
          '700': '#60445f',
          '800': '#513b50',
          '900': '#463445',
          '950': '#2f232e',
          '1000': '#1a141a',
        },
        'outer-space': {
          '50': '#f5f8f7',
          '100': '#dee9e6',
          '200': '#bcd3cd',
          '300': '#93b5ad',
          '400': '#6c958c',
          '500': '#527a73',
          '600': '#40615b',
          '700': '#364f4b',
          '800': '#2e413e',
          '900': '#253230',
          '950': '#141f1e',
          '1000': '#1a2322',
        },
      },
    },
  },
  plugins: [],
};
