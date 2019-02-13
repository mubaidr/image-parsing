const path = require('path')
const { devDependencies } = require('../package.json')

const isDevMode = process.env.NODE_ENV === 'development'

const mainConfig = {
  mode: isDevMode ? 'development' : 'production',
  devtool: isDevMode ? 'source-map' : undefined,
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  externals: Object.keys(devDependencies),
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
    __dirname: isDevMode,
    __filename: isDevMode,
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
