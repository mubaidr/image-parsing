// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote

const settings = require('electron-settings')

async function openDirectory(filters) {
  const dirList = dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: settings.get('open-directory'),
    filters,
    properties: ['openDirectory'],
  })

  const dir = dirList ? dirList[0] : ''
  if (dir) settings.set('open-directory', dir)

  return dir
}

async function openFile(filters) {
  const fileList = dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: settings.get('open-file'),
    filters,
    properties: ['openFile'],
  })

  const file = fileList ? fileList[0] : ''
  if (file) settings.set('open-file', file)

  return file
}

async function saveFile(filters) {
  const file = dialog.showSaveDialog(getCurrentWindow(), {
    defaultPath: settings.get('save-file'),
    filters,
    properties: ['saveFile'],
  })

  if (file) settings.set('save-file', file)

  return file
}

module.exports = {
  openDirectory,
  openFile,
  saveFile,
}
