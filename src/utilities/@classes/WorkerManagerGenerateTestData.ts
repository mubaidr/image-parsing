import path from 'path'

import WorkerManager from './WorkerManager'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManagerGenerateTestData extends WorkerManager {
  constructor() {
    const workerPath = isDev
      ? path.resolve('./dist/workers/workerGenerateAnswerSheets.js')
      : path.resolve(__dirname, './workers/workerGenerateAnswerSheets.js')

    super(workerPath)
  }
}

export default WorkerManagerGenerateTestData
