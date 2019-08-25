import WorkerManager from './@classes/WorkerManager'

let workerManager: WorkerManager

const start = async () => {}

const stop = () => {
  if (workerManager) workerManager.reset()
}

export { start, stop }
