import path from 'path'
import noOfCores from 'physical-cpu-count'

import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'
import { dataPaths } from '../dataPaths'
import { getDesignData } from '../design'
import { getImagePaths } from '../images'
import Result from './Result'
import WorkerManager from './WorkerManager'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManagerExtract extends WorkerManager {
  private results: Result[]

  constructor() {
    const workerPath = isDev
      ? path.resolve('./dist/workers/workerExtract.js')
      : path.resolve(__dirname, './workers/workerExtract.js')

    super(workerPath)

    this.results = []
  }

  public addWorkerHandlers(callbacks: Callbacks): void {
    this.workers.forEach(worker => {
      worker.on(
        'message',
        (data: { state: ProgressStateEnum; results: Result[] }) => {
          console.log(data, callbacks)

          // if (data.state === ProgressStateEnum.COMPLETED) {
          //   this.results.push(...data.results)
          //   if (this.results.length === this.expectedOutputCount) {
          //     const compiledResult = new CompiledResult()
          //     // repair prototype for objects
          //     this.results.forEach(result => {
          //       compiledResult.addResults(Result.fromJson(result))
          //     })
          //     callback({
          //       state: ProgressStateEnum.COMPLETED,
          //       compiledResult: compiledResult,
          //     })
          //   }
          // } else {
          //   callback(data)
          // }
        }
      )

      worker.on('close', (a, b) => {
        if (a) {
          electronLog.info(
            `child process exited with code: ${a} and signal ${b}`
          )
        } else {
          electronLog.info('child process exited with code 0.')
        }
      })

      if (!isDev || !worker.stdout || !worker.stderr) {
        return
      }

      worker.stdout.on('data', (data: Buffer) => {
        electronLog.log(data.toString())
      })

      worker.stderr.on('data', (data: Buffer) => {
        electronLog.error(data.toString())
      })
    })
  }

  public async process(
    options: WorkerManagerInput
  ): Promise<WorkerManagerOutput> {
    options.data.designData = getDesignData(
      options.designPath || dataPaths.designBarcode
    )

    const { callback, data } = options
    const { designData, imagesDirectory } = data

    if (!imagesDirectory) throw 'Invalid imagesDirectory...'

    const totalImages = await getImagePaths(imagesDirectory)
    const totalWorkers = Math.min(totalImages.length, noOfCores)
    const step = Math.floor(totalImages.length / totalWorkers)

    this.expectedOutputCount = totalImages.length
    this.createWorkers(totalWorkers).addWorkerHandlers(callback)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex =
        i === totalWorkers - 1 ? totalImages.length : (i + 1) * step

      this.workers[i].send({
        designData,
        imagePaths: totalImages.slice(startIndex, endIndex),
      })
    }

    return { totalWorkers, totalImages: totalImages.length }
  }
}

export default WorkerManagerExtract
