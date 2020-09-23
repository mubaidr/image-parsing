// @ts-ignore
import('v8-compile-cache')

import { parentPort } from 'worker_threads'
import { CompiledResult } from '../CompiledResult'
import { readKey } from '../readKey'
import { Result } from '../Result'
import { PROGRESS_STATES } from './PROGRESS_STATES'

export type WorkerCompileInputMessage = {
  resultPath: string
  keyPath: string
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
  const { resultPath, keyPath, correctMarks, incorrectMarks } = message
  const results = CompiledResult.loadFromExcel(resultPath).results
  const keys = await readKey(keyPath)

  if (keys === undefined) {
    throw 'keys not provided'
  }

  const compiledResult = new CompiledResult()
    .addKeys(keys)
    .addResults(results)
    .compile(correctMarks, incorrectMarks)

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
