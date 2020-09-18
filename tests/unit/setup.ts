import webpack from 'webpack'
// @ts-ignore
import config from '../../webpack.workers.config.js'

config.mode = 'development'

module.exports = async () => {
  webpack(
    {
      ...config,
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(err)
        process.exit(1)
      }
    }
  )
}
