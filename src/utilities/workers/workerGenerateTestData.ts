import Sharp from 'sharp'

import WorkerInput from '../@interfaces/WorkerInput'

function stop(): void {
  process.exit(0)
}

function start(msg: WorkerInput): void {
  const { designData, results, imagesDirectory, exportDirectory } = msg

  if (!designData) throw 'Invalid results...'
  if (!results) throw 'Invalid results...'
  if (!imagesDirectory) throw 'Invalid imagesDirectory...'
  if (!exportDirectory) throw 'Invalid exportDirectory...'

  console.log(designData, results, imagesDirectory, exportDirectory)

  // TODO: generate svg with all text info
  // Overlay image with generated svg
  // export to provided path with roll-no in the name

  const img = Sharp(
    'D:\\current\\image-parsing\\__tests__\\test-data\\images-barcode\\10023.jpg',
  )

  img.toFile('D:\\current\\image-parsing\\.tmp\\image-with-text.jpg')
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    start(msg)
  }
})

process.on('unhandledRejection', e => console.error(e))
process.on('uncaughtException', e => console.error(e))
process.on('warning', e => console.warn(e))

export { start, stop }
