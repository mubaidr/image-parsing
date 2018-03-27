const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const dataPaths = require('./data-paths')

const net = new brain.NeuralNetwork()
const dirs = fs.readdirSync(dataPaths.sample)
const trainingData = []

console.log('Preparing training data...')

dirs.forEach(dir => {
  const dirPath = path.join(dataPaths.sample, dir)
  const subDirs = fs.readdirSync(dirPath)

  subDirs.forEach((option, index) => {
    const filePath = path.join(dirPath, option)
    const buffer = fs.readFileSync(filePath)

    trainingData.push({
      input: buffer.toJSON().data,
      output: [dir]
    })
  })
})

console.log(trainingData)

console.log('Training started...')

net
  .trainAsync(trainingData, {
    iterations: 10,
    log: true,
    logPeriod: 1,
    timeout: 30000
  })
  .then(status => {
    const result = net.toJSON()

    fs.writeFileSync(dataPaths.trainingOutput, JSON.stringify(result))

    console.log('Traning finished with status: ', status)
  })
