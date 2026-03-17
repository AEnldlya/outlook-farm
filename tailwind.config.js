/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cabinet Grotesk', 'sans-serif'],
        body: ['General Sans', 'sans-serif'],
      },
      colors: {
        'pasture-green': '#2D5A3D',
        'pasture-green-dark': '#1E3D29',
        'cream': '#FDF8F3',
        'earth': '#8B7355',
        'gold': '#C9A227',
      },
    },
  },
  plugins: [],
}
