import path from 'path'
import { Application } from 'spectron'

const appPath = path.join(__dirname, '../../dist/main/index.js')
const electronPath = path.join(
  __dirname,
  '../../node_modules',
  '.bin',
  process.platform === 'win32' ? 'electron.cmd' : 'electron'
)

const app = new Application({
  path: electronPath,
  // args: [appPath, '--enable-logging'],
  args: [appPath],
  env: {
    // ELECTRON_ENABLE_LOGGING: true,
    // ELECTRON_ENABLE_STACK_DUMPING: true,
    NODE_ENV: 'test',
  },
})

beforeAll(async () => {
  jest.setTimeout(15000)
  await app.start()
})

afterAll(async () => {
  if (app && app.isRunning()) {
    await app.stop()
  }
})

describe('Application launch', () => {
  test('shows an initial window', async () => {
    const count = await app.client.getWindowCount()
    expect(count).toBe(1)
  })
})
