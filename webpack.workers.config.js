/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fsGlob = require("fast-glob");
const TerserJSPlugin = require("terser-webpack-plugin");
const { dependencies, devDependencies } = require("./old/package.json");

const externals = Object.keys(dependencies).concat(
  Object.keys(devDependencies)
);
const isDevMode = process.env.NODE_ENV === "development";

const rootPath = path
  .join(__dirname, "./src/utilities/workers/**/", "*.worker.ts")
  .replace(/\\/g, "/");

const entry = {};

fsGlob
  .sync(rootPath, {
    absolute: true,
    onlyFiles: true
  })
  .forEach(workerPath => {
    const split = workerPath.split("/");

    entry[split[split.length - 1].split(".")[0]] = workerPath;
  });

const config = {
  name: "workers",
  mode: process.env.NODE_ENV,
  devtool: isDevMode ? "cheap-module-eval-source-map" : false,
  entry: entry,
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "./dist_electron/workers/"),
    filename: "[name].worker.js"
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.node$/,
        loader: "node-loader"
      }
    ]
  },
  node: {
    __dirname: isDevMode,
    __filename: isDevMode
  },
  plugins: [],
  resolve: {
    extensions: [".ts", ".js", ".json", ".node"]
  },
  target: "node"
};

if (isDevMode) {
  // dev only plugins
  config.plugins.push();
} else {
  config.optimization = {
    minimizer: [new TerserJSPlugin({})]
  };
}

module.exports = config;
