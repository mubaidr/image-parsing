import brain from 'brain.js'
import fs from 'fs'

import CompiledResult from '../@classes/CompiledResult'
import { dataPaths } from '../dataPaths'
import { getDesignData } from '../design'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'

async function start(designPath: string, resultPath: string, keyPath: string) {
  const designData = getDesignData(designPath)
  const sharpImage = getSharpObjectFromSource(resultPath).raw()
  const compiledResult = CompiledResult.loadFromExcel(keyPath)

  const trainingData = await getQuestionsData(
    designData,
    sharpImage,
    compiledResult
  )

  const net = new brain.NeuralNetwork()

  net.train(trainingData, {
    log: true,
    logPeriod: 10,
    errorThresh: 0.001,
  })

  // write trained network configuration to disk
  fs.writeFileSync(dataPaths.questionsModel, JSON.stringify(net.toJSON()))

  if (process && process.send) {
    process.send({ completed: true }, () => {
      process.exit(0)
    })
  }
}

function stop() {
  process.exit(0)
}

// add message listner
process.on('message', msg => {
  if (msg.stop) {
    stop()
  } else {
    start(msg.designPath, msg.resultPath, msg.keyPath)
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
