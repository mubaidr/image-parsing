import { BrowserWindow, FileFilter, OpenDialogOptions, remote } from 'electron'
import * as settings from 'electron-settings'
import dataPaths from './dataPaths'
const { dialog, getCurrentWindow } = remote

const openDirectory = async (
  filters?: FileFilter[]
): Promise<string | undefined> => {
  // @ts-ignore
  const dir = await dialog.showOpenDialog<BrowserWindow, OpenDialogOptions>(
    getCurrentWindow(),
    {
      defaultPath: settings.get('open-directory'),
      filters,
      properties: ['openDirectory'],
    }
  )

  return dir.filePaths
}

const openFile = async (
  filters?: FileFilter[]
): Promise<string[] | undefined> => {
  const file = await dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: dataPaths.home,
    filters,
    properties: ['openFile'],
  })

  return file.filePaths
}

const saveFile = async (
  filters?: FileFilter[]
): Promise<string | undefined> => {
  const file = await dialog.showSaveDialog(getCurrentWindow(), {
    defaultPath: dataPaths.home,
    filters,
  })

  return file.filePath
}

export { openDirectory, openFile, saveFile }
