import Sharp from 'sharp'

import ProgressStateEnum from '../@enums/ProgressStateEnum'
import WorkerTypes from '../@enums/WorkerTypes'
import WorkerInput from '../@interfaces/WorkerInput'
import WorkerOutput from '../@interfaces/WorkerOutput'

function sendMessage(obj: WorkerOutput): void {
  if (process && process.send) {
    process.send(obj)
  }
}

function start(msg: WorkerInput, isChildProcess: boolean): undefined {
  const { designData, results, imagesDirectory, exportDirectory } = msg

  if (!designData) throw new Error('Invalid designData...')
  if (!results) throw new Error('Invalid results...')
  if (!imagesDirectory) throw new Error('Invalid imagesDirectory...')
  if (!exportDirectory) throw new Error('Invalid exportDirectory...')

  console.log(designData, results, imagesDirectory, exportDirectory)

  // TODO: generate svg with all text info
  // Overlay image with generated svg
  // export to provided path with roll-no in the name

  const img = Sharp(
    'D:\\current\\image-parsing\\__tests__\\_test_data\\images-barcode\\10023.jpg'
  )

  img.toFile('D:\\current\\image-parsing\\.tmp\\image-with-text.jpg')

  if (isChildProcess) {
    sendMessage({
      state: ProgressStateEnum.COMPLETED,
      workerType: WorkerTypes.GENERATE_TEST_DATA,
    })
  } else {
    return undefined
  }
}

function stop(): void {
  process.exit(0)
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    start(msg, true)
  }
})

process.on('unhandledRejection', (error, promise) => {
  console.error(error, promise)

  stop()
})

process.on('uncaughtException', error => {
  console.error(error)

  stop()
})

process.on('warning', warning => {
  console.warn(warning)
})

export default { start, stop }
