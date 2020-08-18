const path = require('path')
const webpack = require('webpack')
const fsGlob = require('fast-glob')
const TerserJSPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

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

const entry = {}

fsGlob
  .sync(rootPath, {
    absolute: true,
    onlyFiles: true,
  })
  .forEach(workerPath => {
    const split = workerPath.split('/')

    entry[split[split.length - 1].split('.')[0]] = workerPath
  })

const config = {
  name: 'workers',
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? 'cheap-module-eval-source-map' : false,
  entry: entry,
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/workers/'),
    filename: '[name].js',
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
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.PRODUCT_NAME': JSON.stringify(productName),
    }),
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/'),
      src: path.join(__dirname, '../src/'),
    },
    extensions: ['.ts', '.js', '.json', '.node'],
  },
  target: 'node',
}

if (isDevMode) {
  // dev only plugins
  config.plugins.push()
} else {
  config.optimization = {
    minimizer: [new TerserJSPlugin({})],
  }
}

module.exports = config
