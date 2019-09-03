const path = require('path')
const webpack = require('webpack')
const fsGlob = require('fast-glob')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'

const rootPath = path
  .join(__dirname, '../src/utilities/workers/', '*.ts')
  .replace(/\\/g, '/')

const entries = {}

fsGlob
  .sync(rootPath, {
    absolute: true,
    onlyFiles: true,
  })
  .forEach(workerPath => {
    const split = workerPath.split('/')

    entries[split[split.length - 1].split('.')[0]] = workerPath
  })

const config = {
  name: 'workers',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? 'cheap-module-eval-source-map' : false,
  entry: entries,
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/workers/'),
    filename: '[name].js',
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
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
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/'),
      src: path.join(__dirname, '../src/'),
    },
    extensions: ['.ts', '.js', '.json'],
  },
  target: 'node',
}

/**
 * Adjust rendererConfig for production settings
 */
if (isDevMode) {
  // any dev only config
}

module.exports = config
