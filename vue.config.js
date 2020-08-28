module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  configureWebpack: {
    devtool: 'eval-cheap-module-source-map',
  },
}
