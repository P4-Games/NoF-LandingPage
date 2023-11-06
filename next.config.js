/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}
const path = require('path')
const { i18n } = require('./next-i18next.config')

module.exports = nextConfig
module.exports = {
  i18n,
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
  }
}
