/**
 * @jest-environment node
 */
// import spectron from 'spectron'
// import { testWithSpectron } from 'vue-cli-plugin-electron-builder'
jest.setTimeout(50000)

// TODO: load spectron here
//TODO: check before each test if app is running

describe('Extract Barcode and QRCode using browser BarCodeScanner API', () => {
  test('Should be able to extract barcode & qrcode', async () => {
    // Wait for dev server to start
    // const { app, stopServe } = await testWithSpectron(spectron)
    // const win = app.browserWindow
    // const client = app.client
    // TODO: add sample barcode image to the client window
    // TODO: run extract roll no function in client
    // await stopServe()
  })

  test('should return null when no barcode/qrcode found', async () => {
    // Wait for dev server to start
    // const { app, stopServe } = await testWithSpectron(spectron)
    // const win = app.browserWindow
    // const client = app.client
    // TODO: add sample barcode image to the client window
    // TODO: run extract roll no function in client
    // await stopServe()
  })
})

// TODO: stop app after all tests
