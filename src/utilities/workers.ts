import childProcess from 'child_process'
import os from 'os'
import path from 'path'
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

  //TODO: test build load
  let workerPath =
    process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../../dist/processTaskWorker.js')
      : path.resolve(__dirname, './processTaskWorker.js')

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
