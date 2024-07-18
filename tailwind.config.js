module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'login-background': "url(https://distrisuperapis.com.ar/bandera.jpg)",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
