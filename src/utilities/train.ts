import brain from 'brain.js'
import fs from 'fs'
import { csvToJson } from './csvToJson'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { getSharpObjectFromSource } from './images'
import { getQuestionsData } from './questions'

const completed = (success: boolean): void => {
  if (success) {
    console.log('Completed')
  } else {
    console.log('Failed')
  }

  if (process && process.send) {
    process.send({ completed: true }, () => {
      process.exit(0)
    })
  }
}

async function start() {
  const [designData, resultsData, sharpImage] = await Promise.all([
    getDesignData(dataPaths.design),
    csvToJson(dataPaths.key, true),
    getSharpObjectFromSource(dataPaths.keyImage),
  ])

  const trainingData = await getQuestionsData(
    designData,
    sharpImage,
    resultsData[0]
  )

  const net = new brain.NeuralNetwork()
  net.train(trainingData, {
    log: true,
    logPeriod: 10,
    errorThresh: 0.0001,
  })

  // write trained network configuration to disk
  fs.writeFileSync(dataPaths.questionsModel, JSON.stringify(net.toJSON()))

  completed(true)
}

process.on('message', e => {
  if (e.stop) {
    console.log('Stoping...')
    process.exit(0)
  } else {
    start()
  }
})

export { start }
