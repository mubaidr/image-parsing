// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote

const settings = require('electron-settings')

async function openDirectory(filters) {
  const dir = dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: settings.get('open-directory'),
    filters,
    properties: ['openDirectory'],
  })

  if (dir) settings.set('open-directory', dir)

  return dir ? dir[0] : null
}

async function openFile(filters) {
  const file = dialog.showOpenDialog(getCurrentWindow(), {
    defaultPath: settings.get('open-file'),
    filters,
    properties: ['openFile'],
  })

  if (file) settings.set('open-file', file)

  return file ? file[0] : null
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
