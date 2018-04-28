/* eslint-disable */
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem
} from 'electron'
/* eslint-enable */

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

global.__paths = require('../utilities/data-paths.js').__paths
let mainWindow
let winURL = 'http://localhost:9080'

if (process.env.NODE_ENV === 'production') {
  winURL = `file://${__dirname}/index.html`

  /**
   * Set `__static` path to static files in production
   * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
   */
  // eslint-disable-next-line
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\') // eslint-disable-line
} else {
  require('electron-debug')({ //eslint-disable-line
    showDevTools: true
  })
}

function installDevTools() {
  if (process.env.NODE_ENV === 'development') {
    require('devtron').install() //eslint-disable-line
    // TODO: ionstall vue.js from zip file
  }
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1000,
    height: 700,
    minWidth: 500,
    minHeight: 350,
    backgroundColor: '#f0f0f0',
    webPreferences: {
      nodeIntegrationInWorker: true,
      webSecurity: false
    }
  })

  // mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  installDevTools()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Event handlers
/*
ipcMain.on('set-menu', (event, routes) => {
  console.log(routes)
  const menu = new Menu()
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i]
    const menuItem = new MenuItem({
      label: route.name,
      submenu: [{
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    })
    menu.append(menuItem)
  }

  console.log(menu)

  Menu.setApplicationMenu(menu)
})
*/

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
