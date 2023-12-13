module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es', 'br']
  },

  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development'
}
