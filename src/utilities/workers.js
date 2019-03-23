const childProcess = require('child_process')
const NO_OF_CORES = require('physical-cpu-count')
const os = require('os')

/**
 * Create worker processes equal to cpu cores count
 * @param {Number} imagesCount Minimum number of images in the current set
 * @returns {Array} array of child process forks
 */
async function createWorkerProcesses(imagesCount) {
  const WORKERS = []

  const availMemory = os.freemem() / (1024 * 1024 * 1024)
  const CORE_COUNT = Math.min(
    NO_OF_CORES,
    imagesCount || Infinity,
    availMemory < 0.15 ? 2 : NO_OF_CORES
  )

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
