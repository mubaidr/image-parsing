import path from 'path'
import { Application } from 'spectron'

const appPath = path.join(__dirname, '../../dist/main/index.js')
let electronPath = path.join(
  __dirname,
  '../../node_modules',
  '.bin',
  'electron'
)

if (process.platform === 'win32') {
  electronPath += '.cmd'
}

const app = new Application({
  path: electronPath,
  args: [appPath, '--enable-logging'],
  env: {
    ELECTRON_ENABLE_LOGGING: true,
    ELECTRON_ENABLE_STACK_DUMPING: true,
    NODE_ENV: 'test',
  },
})

beforeAll(async () => {
  return await app.start()
})

afterAll(async () => {
  if (app && app.isRunning()) {
    return await app.stop()
  }
})

describe('Application launch', () => {
  test('shows an initial window', async () => {
    await app.client.waitUntilWindowLoaded()

    console.log('yayyaya')

    const count = await app.client.getWindowCount()
    expect(count).toBe(1)
  })
})
