const styleguide = require('@vercel/style-guide/prettier');
// import styleguide from '@vercel/style-guide/prettier';

module.exports = {
  ...styleguide,
  plugins: [...styleguide.plugins, 'prettier-plugin-tailwindcss'],
};

