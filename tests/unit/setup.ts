import webpack from 'webpack'
// @ts-ignore
import config from '../../webpack.workers.config.js'

// compile workers
module.exports = async () => {
  return new Promise((resolve, reject) => {
    webpack(
      {
        ...config,
      },
      (err, stats) => {
        if (err) reject(err)

        if (stats && stats.hasErrors()) {
          reject(stats.compilation.errors[0])
        }

        resolve(null)
      }
    )
  })
}
