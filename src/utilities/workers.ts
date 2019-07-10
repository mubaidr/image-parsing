import childProcess from 'child_process'
import path from 'path'
import NO_OF_CORES from 'physical-cpu-count'

const createWorkerProcesses = async (): Promise<
  childProcess.ChildProcess[]
> => {
  const WORKERS = []

  let workerPath =
    process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../../dist/processTaskWorker.js')
      : path.resolve(__dirname, './processTaskWorker.js')

  for (let i = 0; i < NO_OF_CORES; i += 1) {
    WORKERS.push(
      childProcess.fork(workerPath, [], {
        silent: true,
      })
    )
  }

  return WORKERS
}

export { createWorkerProcesses }
