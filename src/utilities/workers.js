const childProcess = require('child_process')
const NO_OF_CORES = require('physical-cpu-count')
const os = require('os')

// TODO create worker process on app start
// TODO cleanup or restart worker on stop

/**
 * Create worker processes equal to cpu cores count
 * @param {Number} imagesCount Minimum number of images in the current set
 * @returns {Array} array of child process forks
 */
async function createWorkerProcesses(imagesCount) {
  const WORKERS = []

  const availMemory = (os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)
  let CORE_COUNT = Math.min(NO_OF_CORES, imagesCount || Infinity)

  // If available ram is less than 100MB/200MB, use only one/two worker processes respectively
  if (availMemory < 0.1) {
    CORE_COUNT = 1
  } else if (availMemory < 0.2) {
    CORE_COUNT = 2
  }

  for (let i = 0; i < CORE_COUNT; i += 1) {
    WORKERS.push(
      childProcess.fork(`${__dirname}/processTaskWorker.js`, [], {
        silent: true,
      })
    )
  }

  return WORKERS
}

module.exports = {
  createWorkerProcesses,
}
