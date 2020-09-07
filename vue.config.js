module.exports = {
  configureWebpack: {
    devtool:
      process.env.NODE_ENV === 'development'
        ? 'eval-cheap-module-source-map'
        : false,
  },

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
}
