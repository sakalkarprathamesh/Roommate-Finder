/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1A73E8',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853',
          canvas: '#F8F9FA',
          text: '#202124',
          secondary: '#5F6368',
          border: '#DADCE0',
          blueLight: '#E8F0FE',
          greenLight: '#E6F4EA',
          redLight: '#FCE8E6',
          yellowLight: '#FEF7E0',
          // Dark palette tokens
          darkCanvas: '#1F1F1F',
          darkSurface: '#2D2E30',
          darkBorder: '#3C4043',
          darkText: '#E8EAED',
          darkSecondary: '#9AA0A6',
          darkBlue: '#8AB4F8',
          darkGreen: '#81C995',
          darkRed: '#F28B82',
          darkYellow: '#FDD663',
        },
        brand: {
          50: '#E8F0FE',
          100: '#D2E3FC',
          200: '#AECBFA',
          300: '#8AB4F8',
          400: '#669DF6',
          500: '#4285F4',
          600: '#1A73E8',
          700: '#1967D2',
          800: '#185ABC',
          900: '#174EA6',
          950: '#0d2d6c',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
