import brain from 'brain.js'
import fs from 'fs'

import CompiledResult from '../@classes/CompiledResult'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import DesignData from '../@interfaces/DesignData'
import WorkerInput from '../@interfaces/WorkerInput'
import { dataPaths } from '../dataPaths'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'

function stop(): void {
  process.exit(0)
}

async function start(
  designData: DesignData,
  resultPath: string = dataPaths.result,
  keyPath: string = dataPaths.keyImage,
): Promise<void> {
  const sharpImage = getSharpObjectFromSource(keyPath).raw()
  const compiledResult = CompiledResult.loadFromExcel(resultPath)

  const trainingData = await getQuestionsData(
    designData,
    sharpImage,
    compiledResult,
  )

  const net = new brain.NeuralNetwork()

  const netOutput = net.train(trainingData, {
    log: true,
    logPeriod: 10,
    errorThresh: 0.001,
    iterations: 100,
  })

  if (netOutput.error <= 0.001) {
    fs.writeFileSync(dataPaths.questionsModel, JSON.stringify(net.toJSON()))

    if (process && process.send) {
      process.send(
        { state: ProgressStateEnum.COMPLETED, data: netOutput },
        stop,
      )
    }
  } else {
    throw 'Unable to train...'
  }
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

export { start, stop }
