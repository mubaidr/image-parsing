process.env.NODE_ENV = 'test'

const path = require('path')
const webpack = require('webpack')
const fsGlob = require('fast-glob')

const entry = {}
const rootPath = path
  .join(__dirname, '../src/utilities/workers/', '*.ts')
  .replace(/\\/g, '/')
const {
  dependencies,
  devDependencies,
  productName,
} = require('../package.json')
const externals = Object.keys(dependencies).concat(Object.keys(devDependencies))
const workers = process.argv
  .filter((item, index) => {
    return index > 1
  })
  .map(name => name.toLowerCase())

fsGlob
  .sync(rootPath, {
    absolute: true,
    onlyFiles: true,
  })
  .forEach(workerPath => {
    const split = workerPath.split('/')
    const fileName = split[split.length - 1].split('.')[0]

    workers.forEach(worker => {
      if (fileName.toLowerCase().indexOf(worker.toLowerCase()) !== -1) {
        entry[fileName] = workerPath
      }
    })
  })

const config = {
  name: 'workers',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
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
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.PRODUCT_NAME': JSON.stringify(productName),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json', '.node'],
  },
  target: 'node',
}

webpack(config).run(err => {
  if (err) console.error(err)
})
