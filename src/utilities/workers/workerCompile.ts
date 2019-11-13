import CompiledResult from '../@classes/CompiledResult'
import Result from '../@classes/Result'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import WorkerTypes from '../@enums/WorkerTypes'
import WorkerInput from '../@interfaces/WorkerInput'
import WorkerOutput from '../@interfaces/WorkerOutput'

function sendMessage(obj: WorkerOutput): void {
  if (process && process.send) {
    process.send(obj)
  }
}

function start(
  msg: WorkerInput,
  isChildProcess: boolean,
): CompiledResult | undefined {
  const { results, keys, correctMarks, incorrectMarks } = msg

  if (!results) throw new Error('Invalid results...')
  if (!keys) throw new Error('Invalid keys...')

  const compiledResult = new CompiledResult()

  results.forEach(result => {
    compiledResult.addResults(Result.fromJson(result))
  })

  keys.forEach(key => {
    compiledResult.addKeys(Result.fromJson(key))
  })

  compiledResult.compile(correctMarks, incorrectMarks)

  // report progress status
  if (isChildProcess) {
    sendMessage({
      state: ProgressStateEnum.PROGRESS,
    })

    sendMessage({
      state: ProgressStateEnum.COMPLETED,
      workerType: WorkerTypes.COMPILE,
      data: compiledResult.getKeysAndResults(),
    })
  } else {
    return compiledResult
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

process.on('unhandledRejection', error => {
  console.error(error)

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