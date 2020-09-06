// import fs from "fs";

module.exports = {
  configureWebpack: {
    devtool: "eval-cheap-module-source-map"
  },
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       data: fs.readFileSync("src/variables.scss", "utf-8")
  //     }
  //   }
  // },
  lintOnSave: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
};
