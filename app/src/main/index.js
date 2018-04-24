/* eslint-disable */
let {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem
} = require('electron')

/* eslint-enable */
let path = require('path')
let dotenv = require('dotenv')

let appPath = app.getAppPath()
let envFile = path.resolve(appPath, 'dist/.env')

dotenv.load({
  path: envFile
})

const dataPaths = require('../../../utilities/data-paths.js')

// eslint-disable-next-line
global.__paths = dataPaths()

let mainWindow

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

  // and load the index.html of the app.
  let webUrl
  if (process.env.NODE_ENV === 'development') {
    webUrl = process.env.WEB_URL
  } else {
    let file = path.resolve(appPath, 'dist/web/index.html')
    webUrl = `file://${file}`
  }
  mainWindow.loadURL(webUrl)

  // mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

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
