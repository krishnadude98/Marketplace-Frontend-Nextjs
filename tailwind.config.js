/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'my_bg_image' : "url('../public/5039684.jpg')",
      }
    },
  },
  plugins: [],
};
