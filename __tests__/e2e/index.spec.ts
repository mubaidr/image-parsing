// import electronPath from 'electron'
import path from 'path'
import { Application } from 'spectron'

const appPath = path.join(__dirname, "../../dist/main/index.js")
let electronPath = path.join(__dirname, "../../node_modules", ".bin", "electron")

if (process.platform === "win32") {
  electronPath += ".cmd"
}

const app = new Application({
  path: electronPath,
  args: [appPath],
  env: {
    ELECTRON_ENABLE_LOGGING: true,
    ELECTRON_ENABLE_STACK_DUMPING: true,
    NODE_ENV: "test"
  },
})

describe('Application launch', () => {
  beforeAll(() => {
    return app.start()
  })

  afterAll(function () {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  describe('shows an initial window', () => {
    return app.client.getWindowCount().then((count) => {
      expect(count).toBe(2)
    })
  })
})
