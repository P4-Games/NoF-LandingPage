const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching,
    sw: 'service-worker.js',
    publicExcludes: ['!robots.txt'], // https://github.com/shadowwalker/next-pwa/issues/94
    disable: process.env.NODE_ENV === "development", // to avoid reload with changes in webpack in development
    fallbacks: {
      image: '/images/common/fallback.png'
      // document: '/other-offline',  // if you want to fallback to a custom page other than /_offline
      // font: '/static/font/fallback.woff2',
      // audio: ...,
      // video: ...,
    }
  }
})