import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import noOfCores from 'physical-cpu-count'

import Result from '../@classes/Result'
import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManager {
  public workerPath: string
  public expectedOutputCount: number
  public workers: ChildProcess[]

  public constructor(workerPath: string) {
    this.workerPath = workerPath
    this.expectedOutputCount = 0
    this.workers = []
  }

  public createWorkers(num?: number) {
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
        worker.send({ stop: true })
      }
    }

    this.expectedOutputCount = 0
    this.workers.length = 0
    return this
  }

  public getCount(): number {
    return this.workers.length
  }

  public addWorkerHandlers(callback: Function) {
    this.workers.forEach(worker => {
      worker.on('message', (data: { state: string; results: Result[] }) => {
        console.log(data)

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

    return this
  }

  private processTrain(options: WorkerManagerInput): WorkerManagerOutput {
    const { callback, data } = options
    const { designData, resultPath, keyPath } = data

    if (!resultPath) throw 'Invalid resultPath...'
    if (!keyPath) throw 'Invalid keyPath...'

    this.createWorkers(1)
      .addWorkerHandlers(callback)
      .workers[0].send({
        designData,
        resultPath,
        keyPath,
      })

    this.expectedOutputCount = 1

    return { totalWorkers: 1 }
  }

  public async processExtract(
    options: WorkerManagerInput
  ): Promise<WorkerManagerOutput> {
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

    return { totalWorkers: 1 }
  }

  public processGenerateTestData(
    options: WorkerManagerInput
  ): WorkerManagerOutput {
    console.log(options)

    return { totalWorkers: 1 }
  }

  public processGenerateAnswerSheets(
    options: WorkerManagerInput
  ): WorkerManagerOutput {
    console.log(options)

    return { totalWorkers: 1 }
  }
}

export default WorkerManager
