import brain from 'brain.js'
import fs from 'fs'

import CompiledResult from '../@classes/CompiledResult'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import DesignData from '../@interfaces/DesignData'
import WorkerInput from '../@interfaces/WorkerInput'
import { dataPaths } from '../dataPaths'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'

function sendMessage() {}

async function start(
  designData: DesignData,
  resultPath: string = dataPaths.result,
  keyPath: string = dataPaths.keyImage
): Promise<void> {
  const sharpImage = getSharpObjectFromSource(keyPath).raw()
  const compiledResult = CompiledResult.loadFromExcel(resultPath)

  const trainingData = await getQuestionsData(
    designData,
    sharpImage,
    compiledResult
  )

  const net = new brain.NeuralNetwork()

  const netOutput = net.train(trainingData, {
    log: true,
    logPeriod: 10,
    errorThresh: 0.001,
    iterations: 100,
  })

  if (netOutput.error <= 0.001) {
    // write trained network configuration to disk
    fs.writeFileSync(dataPaths.questionsModel, JSON.stringify(net.toJSON()))

    if (process && process.send) {
      process.send({ state: ProgressStateEnum.COMPLETED }, () => {
        process.exit(0)
      })
    }
  } else {
    throw 'lol hogya'
    // if (process && process.send) {
    //   process.send({ error: true }, () => {
    //     process.exit(0)
    //   })
    // }
  }
}

function stop(): void {
  process.exit(0)
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    if (!msg.designData) throw 'Invalid design data...'
    if (!msg.resultPath) throw 'Invalid resultPath...'
    if (!msg.keyPath) throw 'Invalid keyPath...'

    start(msg.designData, msg.resultPath, msg.keyPath)
  }
})

process.on('unhandledRejection', rejection => {
  console.error(rejection)
})

process.on('uncaughtException', exception => {
  console.error(exception)
})

process.on('warning', warning => {
  console.warn(warning)
})

export { start, stop }
