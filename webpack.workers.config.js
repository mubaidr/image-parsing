/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fsGlob = require('fast-glob')
const TerserJSPlugin = require('terser-webpack-plugin')
const { dependencies, devDependencies } = require('./package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = (env) => {
  const isDevMode = env.NODE_ENV === 'development'
  const externals = Object.keys(dependencies).concat(
    Object.keys(devDependencies)
  )

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

  const config = {
    name: 'workers',
    mode: env.NODE_ENV,
    devtool: isDevMode ? 'eval-cheap-module-source-map' : false,
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
    plugins: [],
    resolve: {
      extensions: ['.ts', '.js', '.json', '.node'],
    },
    target: 'node',
  }

  if (isDevMode) {
    // dev only plugins
    config.plugins.push(new BundleAnalyzerPlugin())
  } else {
    config.optimization = {
      minimizer: [new TerserJSPlugin({})],
    }
  }

  return config
}
