// import('v8-compile-cache')

import { app, BrowserWindow, Menu, shell } from 'electron'
import path from 'path'
import { URL } from 'url'
import { productName } from '../../package.json'

app.setName(productName)
app.allowRendererProcessReuse = true

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const gotTheLock = app.requestSingleInstanceLock()
const isDevEnv = process.env.NODE_ENV === 'development'
const isDebugEnv = process.env.NODE_ENV === 'debug'
const isTestEnv = process.env.NODE_ENV === 'test'
let mainWindow

if (isDevEnv && !isTestEnv) {
  require('electron-debug')({
    showDevTools: !isDebugEnv,
  })
}

// only allow single instance of application
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
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      webSecurity: false,
    },
    show: false,
    backgroundThrottling: false,
  })

  // eslint-disable-next-line
  setMenu()

  // load root file/url
  if (isDevEnv) {
    mainWindow.loadURL('http://localhost:9080')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../', '/renderer/index.html'))

    // @ts-ignore
    global.__static = require('path')
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}

app.on('ready', () => {
  createWindow()

  if (isDevEnv) {
    require('vue-devtools').install()
  }

  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools()
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

app.on('web-contents-created', (e, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (parsedUrl.origin !== 'http://localhost:9080') {
      event.preventDefault()
    }
  })

  contents.on('new-window', async (event, navigationUrl) => {
    // In this example, we'll ask the operating system
    // to open this event's url in the default browser.
    event.preventDefault()

    await shell.openExternal(navigationUrl)
  })
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

const sendMenuEvent = async data => {
  mainWindow.webContents.send('change-view', data)
}

const template = [
  {
    label: app.getName(),
    submenu: [
      {
        label: 'Home',
        // accelerator: 'CommandOrControl+H',
        click() {
          sendMenuEvent({ route: '/home' })
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
        click() {
          sendMenuEvent({ route: '/generate/answer-sheets' })
        },
      },
      {
        label: 'Test Data',
        click() {
          sendMenuEvent({ route: '/generate/_data' })
        },
      },
    ],
  },
  {
    label: 'Process',
    submenu: [
      {
        label: 'Extract Result',
        click() {
          sendMenuEvent({ route: '/process/extract' })
        },
      },
      {
        label: 'Review Result',
        click() {
          sendMenuEvent({ route: '/process/review' })
        },
      },
    ],
  },
  {
    label: 'Compile',
    submenu: [
      {
        label: 'Compile Result',
        click() {
          sendMenuEvent({ route: '/compile' })
        },
      },
    ],
  },
  {
    label: 'Utilities',
    submenu: [
      {
        label: 'Train',
        click() {
          sendMenuEvent({ route: '/utilities/train' })
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
          sendMenuEvent({ route: '/help/contact' })
        },
      },
      {
        label: 'About',
        role: 'about',
        click() {
          sendMenuEvent({ route: '/help/about' })
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
