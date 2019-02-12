const path = require('path')
const { dependencies, devDependencies } = require('../package.json')

const isDevMode = process.env.NODE_ENV !== 'production'

const mainConfig = {
  mode: process.env.NODE_ENV || 'development',
  devtool: isDevMode ? 'source-map' : undefined,
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  externals: Object.keys(dependencies).concat(Object.keys(devDependencies)),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist'),
  },
  resolve: {},
  target: 'electron-main',
}

module.exports = mainConfig
