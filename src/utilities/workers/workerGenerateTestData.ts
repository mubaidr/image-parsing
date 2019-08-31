import WorkerInput from '../@interfaces/WorkerInput'

function stop(): void {
  process.exit(0)
}

const start = (
  resultPath: string,
  imagesDirectory: string,
  exportDirectory: string,
): void => {
  console.log(resultPath, imagesDirectory, exportDirectory)
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    const { resultPath, imagesDirectory, exportDirectory } = msg

    if (!resultPath) throw 'Invalid resultPath...'
    if (!imagesDirectory) throw 'Invalid imagesDirectory...'
    if (!exportDirectory) throw 'Invalid exportDirectory...'

    start(resultPath, imagesDirectory, exportDirectory)
  }
})

process.on('unhandledRejection', e => console.error(e))
process.on('uncaughtException', e => console.error(e))
process.on('warning', e => console.warn(e))

export { start, stop }
