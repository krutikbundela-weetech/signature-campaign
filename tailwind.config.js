/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00A3A5',      // Teal (primary)
          dark: '#008C8E',         // Darker Teal (hover or active)
          light: '#00BDBF',        // Lighter Teal
        },
        accent: {
          coral: '#A53F00',        // Complementary
          yellow: '#FDCB6E',       // Warm highlight
          lavender: '#BFA2DB',     // Soft secondary accent
        },
        neutral: {
          dark: '#1C2B2D',         // Deep neutral (text/headings)
          light: '#F2F5F7',        // Light neutral (backgrounds)
          border: '#D9E2E3',       // For borders/cards
        },
        extra: {
          turquoise: '#00A5C5',    // Analogous
          seagreen: '#00A589',     // Analogous
          midnight: '#2D3047',     // Accent contrast
        }
      }
    }
  },
  plugins: [],
}