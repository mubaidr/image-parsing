import brain from 'brain.js'
import fs from 'fs'
import CompiledResult from './@classes/CompiledResult'
import dataPaths from './dataPaths'
import { getDesignData } from './design'
import { getSharpObjectFromSource } from './images'
import { getQuestionsData } from './questions'

async function start() {
  const trainingData = await getQuestionsData(
    getDesignData(dataPaths.design),
    getSharpObjectFromSource(dataPaths.keyImage),
    CompiledResult.loadFromExcel(dataPaths.key)
  )

  const net = new brain.NeuralNetwork()

  net.train(trainingData, {
    log: true,
    logPeriod: 10,
    errorThresh: 0.0001,
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
