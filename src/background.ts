/* global __static */
import { app, BrowserWindow, Menu, protocol } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { name } from '../package.json'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// set application name from package.json
app.setName(name)
process.env.NAME = name

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 960,
    height: 540,
    minWidth: 760,
    minHeight: 540,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      // experimentalFeatures: true,
      enableBlinkFeatures: 'ShapeDetection,BarcodeDetector,TextDetector',
    },
    // @ts-ignore
    icon: path.join(__static, 'icon.png'),
  })

  // eslint-disable-next-line
  setMenu();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  registerLocalResourceProtocol()

  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// allow loading local resources
function registerLocalResourceProtocol() {
  protocol.registerFileProtocol(
    'local-resource',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (request: { url: string }, callback: (arg0: string) => any) => {
      const url = request.url.replace(/^local-resource:\/\//, '')
      // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
      const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
      try {
        return callback(decodedUrl)
      } catch (error) {
        console.error(
          'ERROR: registerLocalResourceProtocol: Could not get file path:',
          error
        )
      }
    }
  )
}

// setup application menu
function setMenu() {
  const sendMenuEvent = async (data: { route: string }) => {
    if (win) win.webContents.send('change-view', data)
  }

  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
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
          label: 'Compile Result',
          click() {
            sendMenuEvent({ route: '/process/compile' })
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
      role: 'help',
      submenu: [
        {
          label: 'Get Help',
          // role: 'help',
          accelerator: 'F1',
          click() {
            sendMenuEvent({ route: '/help/contact' })
          },
        },
        {
          label: 'About',
          // role: 'about',
          click() {
            sendMenuEvent({ route: '/help/about' })
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}
