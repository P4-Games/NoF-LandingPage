/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}
const path = require('path')
const { i18n } = require('./next-i18next.config')
const { pwa } = require('./next-pwa.config')

module.exports = nextConfig
module.exports = {
  i18n,
  pwa,
  // https://nextjs.org/docs/api-reference/next.config.js/compression
  compress: true,
  images: {
    domains: ['storage.googleapis.com']
  },
  output: 'standalone',
  webpack(config, options) {
    const { isServer } = options
    config.resolve.modules.push(path.resolve('./src'))
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|flac|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false
          }
        }
      ]
    })

    return config
  },
  // https://nextjs.org/docs/api-reference/next.config.js/headers
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=9999999999, must-revalidate'
          }
        ]
      }
    ]
  }
}
