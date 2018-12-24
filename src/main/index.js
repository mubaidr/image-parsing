/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow, Menu } = require('electron')
/* eslint-enable */
const pkg = require('../../package.json')

app.setName(pkg.productName)

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let mainWindow
let winURL = 'http://localhost:9080'
const gotTheLock = app.requestSingleInstanceLock()

// only allow single instance of application

// eslint-disable-next-line
app.on('second-instance', (commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

if (!gotTheLock) {
  app.quit()
  process.exit(0)
}

if (process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line
    require('electron-debug')()
  } catch (err) {
    console.log(
      'Failed to install `electron-debug`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ',
    )
  }
} else {
  winURL = `file://${__dirname}/index.html`

  /**
   * Set `__static` path to static files in production
   * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
   */
  // eslint-disable-next-line
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\') // eslint-disable-line
}

function installDevTools() {
  try {
    require('devtron').install() //eslint-disable-line
    require('vue-devtools').install() //eslint-disable-line
  } catch (err) {
    console.log(
      'Failed to install `devtron` & `vue-devtools`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ',
    )
  }
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    // useContentSize: true,
    // backgroundColor: '#fff',
    minHeight: 480,
    minWidth: 480,
    webPreferences: {
      nodeIntegrationInWorker: false,
      webSecurity: true,
    },
    show: false,
    // transparent: true,
    // frame: false,
    // toolbar: false,
  })

  // eslint-disable-next-line
  setMenu()
  mainWindow.loadURL(winURL)
  // mainWindow.setMenu(null)

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.setTitle(pkg.productName)
    mainWindow.show()
    mainWindow.focus()

    if (
      process.env.ELECTRON_ENV === 'development' ||
      process.argv.indexOf('--debug') !== -1
    ) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()

  if (process.env.NODE_ENV === 'development') {
    installDevTools()
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

function sendMenuEvent(e) {
  mainWindow.webContents.send('event', e)
}

function setMenu() {
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
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
      },
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

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
