// import { FileFilter, remote } from 'electron'

export { };

// // import { store } from './store'

// const { dialog, getCurrentWindow } = remote

// const openDirectory = async (
//   filters?: FileFilter[]
// ): Promise<string | undefined> => {
//   const dir = await dialog.showOpenDialog(getCurrentWindow(), {
//     defaultPath: store.lastOpenDir(),
//     filters,
//     properties: ['openDirectory'],
//   })

//   const dest = dir.filePaths ? dir.filePaths[0] : undefined

//   if (dest) store.updateLastOpenDir(dest)

//   return dest
// }

// const openFile = async (
//   filters?: FileFilter[]
// ): Promise<string | undefined> => {
//   const file = await dialog.showOpenDialog(getCurrentWindow(), {
//     defaultPath: store.lastOpenFile(),
//     filters,
//     properties: ['openFile'],
//   })

//   const dest = file.filePaths ? file.filePaths[0] : undefined

//   if (dest) store.updateLastOpenFile(dest)

//   return dest
// }

// const saveFile = async (
//   filters?: FileFilter[]
// ): Promise<string | undefined> => {
//   const file = await dialog.showSaveDialog(getCurrentWindow(), {
//     defaultPath: store.lastSaveDir(),
//     filters,
//   })

//   const dest = file.filePath ? file.filePath : undefined

//   if (dest) store.updateLastSaveDir(dest)

//   return dest
// }

// export { openDirectory, openFile, saveFile }
