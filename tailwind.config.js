/** @type {import('tailwindcss').Config} */

import colors from "tailwindcss/colors"

export default {
  content: ["./index.tsx",
      "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#202225',
        secondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          ["dark-hover"]: colors.neutral[900],
        },
      },
    },
  },
  plugins: [],
}