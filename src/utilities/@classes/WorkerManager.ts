import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import path from 'path'
import noOfCores from 'physical-cpu-count'

import Result from '../@classes/Result'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import WorkerTypesEnum from '../@enums/WorkerTypesEnum'
import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'
import { getDesignData } from '../design'
import { getImagePaths } from '../images'
import CompiledResult from './CompiledResult'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManager {
  private workerType: WorkerTypesEnum
  private workerPath: string
  private expectedOutputCount: number = 0
  private workers: ChildProcess[] = []
  private results: Result[] = []

  public constructor(type: WorkerTypesEnum) {
    this.workerType = type

    switch (type) {
      case WorkerTypesEnum.TRAIN:
        this.workerPath = isDev
          ? path.resolve('./dist/workers/trainTaskWorker.js')
          : path.resolve(__dirname, './workers/trainTaskWorker.js')
        break
      case WorkerTypesEnum.GENERATE_ANSWER_SHEET:
        this.workerPath = isDev
          ? path.resolve('./dist/workers/generateAnswerSheetsTaskWorker.js')
          : path.resolve(
              __dirname,
              './workers/generateAnswerSheetsTaskWorker.js'
            )
        break
      case WorkerTypesEnum.GENERATE_TEST_DATA:
        this.workerPath = isDev
          ? path.resolve('./dist/workers/generateTestDataTaskWorker.js')
          : path.resolve(__dirname, './workers/generateTestDataTaskWorker.js')
        break
      case WorkerTypesEnum.EXTRACT:
      default:
        this.workerPath = isDev
          ? path.resolve('./dist/workers/extractTaskWorker.js')
          : path.resolve(__dirname, './workers/extractTaskWorker.js')
        break
    }
  }

  public create(num?: number) {
    const count = num === undefined ? noOfCores : num

    for (let i = 0; i < count; i += 1) {
      this.workers.push(
        childProcess.fork(this.workerPath, [], {
          silent: true,
        })
      )
    }

    return this
  }

  public stop() {
    for (const worker of this.workers) {
      if (worker.connected) {
        worker.kill()
      }
    }

    this.expectedOutputCount = 0
    this.workers.length = 0
    this.results.length = 0
  }

  public getCount(): number {
    return this.workers.length
  }

  private addWorkerHandlers(callback: Function) {
    this.workers.forEach(worker => {
      worker.on('message', (data: { state: string; results: Result[] }) => {
        if (data.state === ProgressStateEnum.COMPLETED) {
          this.results.push(...data.results)

          if (this.results.length === this.expectedOutputCount) {
            const compiledResult = new CompiledResult()

            // repair prototype for objects
            this.results.forEach(result => {
              compiledResult.addResults(Result.fromJson(result))
            })

            callback({
              state: ProgressStateEnum.COMPLETED,
              compiledResult: compiledResult,
            })
          }
        } else {
          callback(data)
        }
      })

      worker.on('close', (a, b) => {
        if (a) {
          // TODO: track error state in parent
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
    let totalWorkers = 0
    let totalImages: string[] = []
    let step = 0

    if (!options.designPath) throw 'Invalid design path...'

    const designData = getDesignData(options.designPath)

    switch (this.workerType) {
      case WorkerTypesEnum.TRAIN:
        break
      case WorkerTypesEnum.GENERATE_ANSWER_SHEET:
        break
      case WorkerTypesEnum.GENERATE_TEST_DATA:
        break
      case WorkerTypesEnum.EXTRACT:
      default:
        if (!options.imagesDirectory) throw 'Invalid images directory...'

        totalImages = await getImagePaths(options.imagesDirectory)
        totalWorkers = Math.min(totalImages.length, noOfCores)
        step = Math.floor(totalImages.length / totalWorkers)
        this.expectedOutputCount = totalImages.length

        this.create(totalWorkers).addWorkerHandlers(options.callback)

        for (let i = 0; i < totalWorkers; i += 1) {
          const startIndex = i * step
          const endIndex =
            i === totalWorkers - 1 ? totalImages.length : (i + 1) * step

          this.workers[i].send({
            designData: designData,
            imagePaths: totalImages.slice(startIndex, endIndex),
          })
        }
        break
    }

    return { totalWorkers: totalWorkers, totalImages: totalImages.length }
  }
}

export default WorkerManager
