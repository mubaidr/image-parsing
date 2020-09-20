import webpack from 'webpack'
// @ts-ignore
import config from '../../webpack.workers.config.js'

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
