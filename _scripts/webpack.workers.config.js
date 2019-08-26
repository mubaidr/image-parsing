const path = require('path')
const webpack = require('webpack')

const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')

const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const isDevMode = process.env.NODE_ENV === 'development'

const config = {
  name: 'workers',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? 'cheap-module-eval-source-map' : false,
  entry: {
    workerExtract: path.join(
      __dirname,
      '../src/utilities/workers/workerExtract.ts'
    ),
    workerGenerateAnswerSheets: path.join(
      __dirname,
      '../src/utilities/workers/workerGenerateAnswerSheets.ts'
    ),
    workerGenerateTestData: path.join(
      __dirname,
      '../src/utilities/workers/workerGenerateTestData.ts'
    ),
    workerTrain: path.join(
      __dirname,
      '../src/utilities/workers/workerTrain.ts'
    ),
  },
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
