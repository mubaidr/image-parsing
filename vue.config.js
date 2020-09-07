// import fs from "fs";

module.exports = {
  configureWebpack: {
    devtool: 'eval-cheap-module-source-map',
  },

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  }
}
