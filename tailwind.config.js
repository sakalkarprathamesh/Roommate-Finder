/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4fc',
          100: '#dde6f8',
          200: '#c2d4f3',
          300: '#98bbeb',
          400: '#689bdf',
          500: '#437cd3',
          600: '#2f61c0',
          700: '#274ea0',
          800: '#1e3a78',
          900: '#0f2452',
          950: '#08132d',
        },
        mit: {
          maroon: '#800020',
          crimson: '#9b111e',
          navy: '#002147',
          gold: '#d4af37',
        }
      },
    },
  },
  plugins: [],
}
