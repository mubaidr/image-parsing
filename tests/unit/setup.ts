import webpack from 'webpack'
// @ts-ignore
import config from '../../webpack.workers.config.js'

// enable dev mode for workers
config.mode = 'development'
config.devtool = 'eval-cheap-module-source-map'
config.node = {
  __dirname: true,
  __filename: true,
}

// compile workers
module.exports = async () => {
  webpack(
    {
      ...config,
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(err || stats.compilation.errors[0])
        process.exit(1)
      }
    }
  )
}
