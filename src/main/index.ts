import electronSettings from 'electron-settings'
import { productName } from '../../package.json'

// import * as devtron from 'devtron'
// import electronDebug from 'electron-debug'
// import * as vueDevtools from 'vue-devtools'

import { app, BrowserWindow, Menu } from 'electron'
import { dataPaths } from '../utilities/dataPaths'

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const gotTheLock = app.requestSingleInstanceLock()
const isDev = process.env.NODE_ENV === 'development'
let mainWindow: BrowserWindow

// only allow single instance of application
if (!isDev) {
  if (gotTheLock) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow && mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    })
  } else {
    app.quit()
    process.exit(0)
  }
} else {
  // electronDebug()
}

async function installDevTools() {
  try {
    // devtron.install()
    // vueDevtools.install()
  } catch (err) {
    console.log(err)
  }
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    backgroundColor: '#fff',
    width: 960,
    height: 540,
    minWidth: 960,
    minHeight: 540,
    // useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      webSecurity: false,
    },
    show: false,
  })

  setMenu()

  // load root file/url
  if (isDev) {
    mainWindow.loadURL('http://localhost:9080')
  } else {
    mainWindow.loadFile(`${__dirname}/index.html`)

    // @ts-ignore
    global.__static = require('path')
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.setTitle(productName)

    if (isDev || process.argv.indexOf('--debug') > -1) {
      mainWindow.webContents.openDevTools()
    }

    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    console.log('closed')
  })
}

app.on('ready', () => {
  app.setName(productName)
  createWindow()

  if (isDev) {
    installDevTools()

    // reset settings
    electronSettings.set('open-directory', dataPaths.home)
    electronSettings.set('open-file', dataPaths.home)
    electronSettings.set('save-file', dataPaths.home)
  }
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

type sendMenuEventGetter = (data: { route: string }) => Promise<void>

const sendMenuEvent: sendMenuEventGetter = async data => {
  mainWindow.webContents.send('event', data)
}

const template = [
  {
    label: app.getName(),
    submenu: [
      {
        label: 'Home',
        accelerator: 'CommandOrControl+H',
        click() {
          sendMenuEvent({ route: '/' })
        },
      },
      { type: 'separator' },
      { role: 'minimize' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'quit', accelerator: 'Alt+F4' },
    ],
  },
  {
    label: 'Generate',
    submenu: [
      {
        label: 'Answer Sheets',
        accelerator: 'CommandOrControl+G',
        click() {
          sendMenuEvent({ route: '/generate' })
        },
      },
    ],
  },
  {
    label: 'Process',
    submenu: [
      {
        label: 'Extract Result',
        accelerator: 'CommandOrControl+P',
        click() {
          sendMenuEvent({ route: '/process' })
        },
      },
    ],
  },
  {
    label: 'Compile',
    submenu: [
      {
        label: 'Compile Result',
        accelerator: 'CommandOrControl+C',
        click() {
          sendMenuEvent({ route: '/compile' })
        },
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Get Help',
        role: 'help',
        accelerator: 'F1',
        click() {
          sendMenuEvent({ route: '/help' })
        },
      },
      {
        label: 'About',
        role: 'about',
        accelerator: 'CommandOrControl+A',
        click() {
          sendMenuEvent({ route: '/about' })
        },
      },
    ],
  },
]

function setMenu() {
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })

    // Edit menu
    template[1].submenu.push(
      // @ts-ignore
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ]
  }

  // @ts-ignore
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
