process.env.NODE_ENV = 'development'

/* eslint-disable*/
const electron = require('electron')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')
const kill = require('tree-kill')
/* eslint-enable */

const path = require('path')
const { spawn } = require('child_process')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

let electronProcess = null

async function startRenderer() {
  // eslint-disable-next-line
  return new Promise(resolve => {
    const compiler = webpack(rendererConfig)
    const hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
    })

    compiler.hooks.afterEmit.tap('afterEmit', () => {
      // renderer compiled
    })

    const server = new WebpackDevServer(compiler, {
      hot: true,
      quiet: true,
      before(app, ctx) {
        app.use(hotMiddleware)

        ctx.middleware.waitUntilValid(() => {
          resolve()
        })
      },
    })

    server.listen(9080)
  })
}

function restartElectron() {
  const { pid } = electronProcess || {}
  if (pid) {
    kill(pid, err => {
      if (err) console.error(err)
    })
  }

  electronProcess = spawn(
    electron,
    [path.join(__dirname, '..', '/dist/electron/main.js')],
    {
      detached: false,
    }
  )
}

function startMain() {
  const compiler = webpack(mainConfig)

  compiler.hooks.afterEmit.tap('afterEmit', () => {
    restartElectron()
  })

  compiler.watch({}, err => {
    if (err) console.error(err)
  })
}

startRenderer().then(startMain)
