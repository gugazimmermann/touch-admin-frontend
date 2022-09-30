const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        pageBackgroung: "#e2e8f0",
        primary: "#f59e0b",
        secondary: "#10b981",
        warning: "#a855f7",
        danger: "#dc2626",
        background: "#f8fafc",
        text: "#475569",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
