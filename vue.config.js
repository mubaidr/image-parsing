/* eslint-disable @typescript-eslint/no-var-requires */
const { DefinePlugin } = require('webpack')
const { name } = require('./package.json')

module.exports = {
  configureWebpack: {
    devtool:
      process.env.NODE_ENV === 'development'
        ? 'eval-cheap-module-source-map'
        : false,
    plugins: [
      new DefinePlugin({
        'process.env.NAME': name,
      }),
    ],
  },

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
}
