import { CompiledResult } from '../CompiledResult'
import { Result } from '../Result'
import { PROGRESS_STATES } from './PROGRESS_STATES'

export type WorkerCompileInputMessage = {
  resultPath: string
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
  isWorker = true
): Promise<CompiledResult | undefined> {
  const { resultPath, keys, correctMarks, incorrectMarks } = message
  const compiledResult = CompiledResult.loadFromExcel(resultPath).addKeys(keys)

  if (correctMarks && incorrectMarks) {
    compiledResult.compile(correctMarks, incorrectMarks)
  }

  // report progress status
  if (isWorker) {
    sendMessage({
      progressState: PROGRESS_STATES.PROGRESS,
    })

    sendMessage({
      progressState: PROGRESS_STATES.COMPLETE,
      payload: compiledResult.getKeysAndResults(),
    })
  } else {
    return compiledResult
  }
}

if (process && process.send) {
  process.on('message', (payload: WorkerCompileInputMessage) => {
    start(payload)
  })
}
