import webpack from 'webpack'
// @ts-ignore
import config from '../../webpack.workers.config.js'

// enable dev mode for workers
config.mode = 'development'
config.devtool = 'eval-source-map'
config.plugins = []
config.optimization = {}
config.node = {
  __dirname: true,
  __filename: true,
}

// compile workers
module.exports = async () => {
  return new Promise((resolve, reject) => {
    webpack(
      {
        ...config,
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          reject(err || stats.compilation.errors[0])
        }

        resolve(null)
      }
    )
  })
}
