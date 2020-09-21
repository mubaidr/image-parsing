// @ts-ignore
import('v8-compile-cache')

import { parentPort } from 'worker_threads'
import { CompiledResult } from '../CompiledResult'
import { Result } from '../Result'
import { PROGRESS_STATES } from './PROGRESS_STATES'

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
  if (parentPort) {
    parentPort.postMessage(message)
  }
}

export async function start(
  message: WorkerCompileInputMessage,
  isWorker = true
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
  } else {
    return compiledResult
  }
}

if (parentPort) {
  parentPort.on('message', (payload: WorkerCompileInputMessage) => {
    start(payload)
  })
}
