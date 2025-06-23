/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // Add typography plugin for markdown styling
    // Optional: Add a plugin for custom scrollbar styling if needed
    // require('tailwind-scrollbar'),
  ],
}