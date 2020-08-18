import { dataPaths } from '../../src/utilities/dataPaths'
import { store } from '../../src/utilities/store'

describe('store', () => {
  test('should be defined', () => {
    expect(store).toBeDefined()

    store.updateLastOpenDir(dataPaths.imagesBarcode)
    store.updateLastOpenFile(dataPaths.keyImage)
    store.updateLastSaveDir(dataPaths.imagesBarcode)
    store.updateLastSaveFile(dataPaths.keyImage)

    expect(store.lastOpenDir()).toBe(dataPaths.imagesBarcode)
    expect(store.lastOpenFile()).toBe(dataPaths.keyImage)
    expect(store.lastSaveDir()).toBe(dataPaths.imagesBarcode)
    expect(store.lastSaveFile()).toBe(dataPaths.keyImage)

    store.clear()

    expect(typeof store.lastOpenDir()).toBe('string')
    expect(typeof store.lastOpenFile()).toBe('string')
    expect(typeof store.lastSaveDir()).toBe('string')
    expect(typeof store.lastSaveFile()).toBe('string')
  })
})
