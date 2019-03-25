const path = require('path')
// eslint-disable-next-line
const webpack = require('webpack')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'
const whiteListedModules = []

const config = {
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? 'cheap-module-eval-source-map' : false,
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  externals: externals.filter(d => !whiteListedModules.includes(d)),
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PRODUCT_NAME': JSON.stringify(productName),
    }),
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist'),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  target: 'electron-main',
}

module.exports = config
