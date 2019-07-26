import Store from 'electron-store'
import dataPaths from './dataPaths'

const newStore = new Store()

const store = {
  // export store methods
  get: newStore.get,
  set: newStore.set,

  // get last used file/ dir paths
  lastOpenDir: () => {
    const lastOpenDir = newStore.get('openDirectory')

    return typeof lastOpenDir === 'string' ? lastOpenDir : dataPaths.home
  },
  lastSaveDir: () => {
    const lastOpenDir = newStore.get('saveDirectory')

    return typeof lastOpenDir === 'string' ? lastOpenDir : dataPaths.home
  },
  lastOpenFile: () => {
    const lastOpenDir = newStore.get('openFile')

    return typeof lastOpenDir === 'string' ? lastOpenDir : dataPaths.home
  },
  lastSaveFile: () => {
    const lastOpenDir = newStore.get('saveFile')

    return typeof lastOpenDir === 'string' ? lastOpenDir : dataPaths.home
  },

  // update last used file/ dir paths
  updateLastOpenDir: (value: string): string => {
    newStore.set('openDirectory', value)

    return value
  },
  updateLastSaveDir: (value: string): string => {
    newStore.set('saveDirectory', value)

    return value
  },
  updateLastOpenFile: (value: string): string => {
    newStore.set('openFile', value)

    return value
  },
  updateLastSaveFile: (value: string): string => {
    newStore.set('saveFile', value)

    return value
  },
}

export default store
