import CompiledResult from '../@classes/CompiledResult'
import Result from '../@classes/Result'
import { PROGRESS_STATES } from '../@classes/WorkerManager'
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

  results.forEach((result) => {
    compiledResult.addResults(Result.fromJson(result))
  })

  keys.forEach((key) => {
    compiledResult.addKeys(Result.fromJson(key))
  })

  compiledResult.compile(correctMarks, incorrectMarks)

  // report progress status
  if (isChildProcess) {
    sendMessage({
      state: PROGRESS_STATES.PROGRESS,
      workerType: WORKER_TYPES.COMPILE,
      timeElapsed: 0,
    })

    sendMessage({
      state: PROGRESS_STATES.SUCCESS,
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

process.on('unhandledRejection', (error) => {
  console.error(error)

  stop()
})

process.on('uncaughtException', (error) => {
  console.error(error)

  stop()
})

process.on('warning', (warning) => {
  console.warn(warning)
})

export default { start, stop }
