/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fsGlob = require('fast-glob')
const { dependencies, devDependencies } = require('./package.json')
const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin

const externals = Object.keys(dependencies)
  .concat(Object.keys(devDependencies))
  .concat(['@zxing/library/esm5'])
const rootPath = path
  .join(__dirname, './src/utilities/workers/**/', '*.worker.ts')
  .replace(/\\/g, '/')
const entry = {}

fsGlob
  .sync(rootPath, {
    absolute: true,
    onlyFiles: true,
  })
  .forEach((workerPath) => {
    const split = workerPath.split('/')
    entry[split[split.length - 1].split('.')[0]] = workerPath
  })

const isDevMode =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

const config = {
  name: 'workers',
  mode: isDevMode ? 'development' : 'production',
  devtool: isDevMode ? 'eval-source-map' : false,
  entry: entry,
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, './dist_electron/workers/'),
    filename: '[name].worker.js',
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'esbuild-loader',
        options: {
          target: 'node12',
        },
      },
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
          target: 'node12',
        },
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
  plugins: [new ESBuildPlugin()],
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node'],
  },
  target: 'node',
}

if (isDevMode) {
  // dev only plugins
  // config.plugins.push(new BundleAnalyzerPlugin())
} else {
  config.optimization = {
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'node12',
      }),
    ],
  }
}

module.exports = config
