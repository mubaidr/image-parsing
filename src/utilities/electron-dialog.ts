import { BrowserWindow, FileFilter, OpenDialogOptions, remote } from 'electron'
import * as settings from 'electron-settings'

const { dialog, getCurrentWindow } = remote

const openDirectory = async (
  filters?: FileFilter[]
): Promise<string | void> => {
  // @ts-ignore
  const dirList = dialog.showOpenDialog<BrowserWindow, OpenDialogOptions>(
    getCurrentWindow(),
    {
      defaultPath: settings.get('open-directory'),
      filters,
      properties: ['openDirectory'],
    }
  )

  const dir = dirList ? dirList[0] : null
  if (dir) {
    settings.set('open-directory', dir)
  }

  return dir
}

const openFile = async (filters?: FileFilter[]): Promise<string | void> => {
  // @ts-ignore
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

const saveFile = async (filters?: FileFilter[]): Promise<string | void> => {
  // @ts-ignore
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

export { openDirectory, openFile, saveFile }
