import childProcess from 'child_process'
import * as workerPath from 'file-loader?name=[name].js!./processTaskWorker'
import os from 'os'
import NO_OF_CORES from 'physical-cpu-count'

type createWorkerProcessesGetter = (
  imagesCount: number
) => Promise<childProcess.ChildProcess[]>

const createWorkerProcesses: createWorkerProcessesGetter = async imagesCount => {
  const WORKERS = []

  const availMemory = os.freemem() / (1024 * 1024 * 1024)
  const CORE_COUNT = Math.min(
    NO_OF_CORES,
    imagesCount || Infinity,
    availMemory < 0.15 ? 2 : NO_OF_CORES
  )

  for (let i = 0; i < CORE_COUNT; i += 1) {
    WORKERS.push(
      childProcess.fork(workerPath, [], {
        silent: true,
      })
    )
  }

  return WORKERS
}

export { createWorkerProcesses }
