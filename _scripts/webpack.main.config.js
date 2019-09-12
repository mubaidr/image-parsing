const path = require('path')
const webpack = require('webpack')
const TerserJSPlugin = require('terser-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'

const config = {
  name: 'main',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? 'cheap-module-eval-source-map' : false,
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
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
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': path.join(__dirname, '../src/'),
      src: path.join(__dirname, '../src/'),
    },
  },
  target: 'electron-main',
}

if (isDevMode) {
  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
    }),
  )
} else {
  config.optimization = {
    minimizer: [new TerserJSPlugin({})],
  }
}

module.exports = config
