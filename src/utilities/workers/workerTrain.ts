import brain, { INeuralNetworkState } from 'brain.js'
import fs from 'fs'

import CompiledResult from '../@classes/CompiledResult'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import WorkerTypes from '../@enums/WorkerTypes'
import WorkerInput from '../@interfaces/WorkerInput'
import WorkerOutput from '../@interfaces/WorkerOutput'
import { dataPaths } from '../dataPaths'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'

function sendMessage(obj: WorkerOutput): void {
  if (process && process.send) {
    process.send(obj)
  }
}

async function start(
  msg: WorkerInput,
  isChildProcess: boolean,
): Promise<INeuralNetworkState | undefined> {
  const { designData, resultPath, keyPath } = msg

  if (!designData) throw new Error('Invalid designData...')
  if (!resultPath) throw new Error('Invalid resultPath...')
  if (!keyPath) throw new Error('Invalid keyPath...')

  const sharpImage = getSharpObjectFromSource(keyPath)
  const compiledResult = CompiledResult.loadFromExcel(resultPath)

  const trainingData = await getQuestionsData(
    designData,
    sharpImage,
    compiledResult,
  )

  const net = new brain.NeuralNetwork()

  const netOutput = net.train(trainingData, {
    log: false,
    logPeriod: 10,
    errorThresh: 0.001,
    iterations: 100,
  })

  if (process.env.NODE_ENV !== 'test') {
    fs.writeFileSync(dataPaths.questionsModel, JSON.stringify(net.toJSON()))
  }

  if (isChildProcess) {
    sendMessage({
      state: ProgressStateEnum.COMPLETED,
      workerType: WorkerTypes.TRAIN,
      data: netOutput,
    })
  } else {
    return netOutput
  }
}

function stop(): void {
  process.exit(0)
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    start(msg, true)
  }
})

process.on('unhandledRejection', (error, promise) => {
  console.error(error, promise)

  stop()
})

process.on('uncaughtException', error => {
  console.error(error)

  stop()
})

process.on('warning', warning => {
  console.warn(warning)
})

export default { start, stop }
