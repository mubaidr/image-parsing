import { remote } from 'electron'
import * as settings from 'electron-settings'

const { dialog, getCurrentWindow } = remote

type openDirectoryGetter = (filters: string[]) => Promise<string | void>

const openDirectory: openDirectoryGetter = async filters => {
  const dirList = dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: settings.get('open-directory'),
    filters,
    properties: ['openDirectory'],
  })

  const dir = dirList ? dirList[0] : null
  if (dir) {
    settings.set('open-directory', dir)
  }

  return dir
}

type openFileGetter = (filters: string[]) => Promise<string | void>

const openFile: openFileGetter = async filters => {
  const fileList = dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: settings.get('open-file'),
    filters,
    properties: ['openFile'],
  })

  const file = fileList ? fileList[0] : ''
  if (file) {
    settings.set('open-file', file)
  }

  return file
}

type saveFileGetter = (filters: string[]) => Promise<string | void>

const saveFile: saveFileGetter = async filters => {
  const file = dialog.showSaveDialog(getCurrentWindow(), {
    defaultPath: settings.get('save-file'),
    filters,
    properties: ['saveFile'],
  })

  if (file) {
    settings.set('save-file', file)
  }

  return file
}

module.exports = {
  openDirectory,
  openFile,
  saveFile,
}
