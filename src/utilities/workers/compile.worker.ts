import CompiledResult from '../CompiledResult'
import Result from '../Result'
import { PROGRESS_STATES } from './WorkerManager'

export type WorkerCompileInputMessage = {
  results: Result[]
  keys: Result[]
  correctMarks?: number
  incorrectMarks?: number
}

export type WorkerCompileOutputMessage = {
  progressState: PROGRESS_STATES
  payload?: Result[]
}

function sendMessage(message: WorkerCompileOutputMessage): void {
  if (process && process.send) {
    process.send(message)
  }
}

export async function start(
  message: WorkerCompileInputMessage,
  isWorker = true,
): Promise<CompiledResult | undefined> {
  const { results, keys, correctMarks, incorrectMarks } = message
  const compiledResult = new CompiledResult()

  results.forEach((result) => {
    compiledResult.addResults(Result.fromJson(result))
  })

  keys.forEach((key) => {
    compiledResult.addKeys(Result.fromJson(key))
  })

  compiledResult.compile(correctMarks, incorrectMarks)

  // report progress status
  if (isWorker) {
    sendMessage({
      progressState: PROGRESS_STATES.PROGRESS,
    })

    sendMessage({
      progressState: PROGRESS_STATES.COMPLETE,
      payload: compiledResult.getKeysAndResults(),
    })

    process.exit(0)
  } else {
    return compiledResult
  }
}

process.on('message', (message: WorkerCompileInputMessage) => {
  start(message)
})

process.on('unhandledRejection', (error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})

process.on('warning', (warning) => {
  // eslint-disable-next-line no-console
  console.warn(warning)
})
