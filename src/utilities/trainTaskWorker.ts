import brain from 'brain.js'
import fs from 'fs'

import CompiledResult from './@classes/CompiledResult'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { getSharpObjectFromSource } from './images'
import { getQuestionsData } from './questions'

async function start() {
  const designData = getDesignData(dataPaths.designBarcode)
  const sharpImage = getSharpObjectFromSource(dataPaths.keyImage).raw()
  const compiledResult = CompiledResult.loadFromExcel(dataPaths.key)

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

process.on('message', e => {
  if (e.stop) {
    process.exit(0)
  } else {
    start()
  }
})

export { start }
