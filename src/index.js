const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const dataPaths = require('./data-paths')
const sharp = require('sharp')

const utilities = require('./utilities.js')

// const net = new brain.NeuralNetwork()
const net = new brain.recurrent.RNN()
const dirs = fs.readdirSync(dataPaths.sample)
const trainingData = []

console.log('\nPreparing training data...')

dirs.forEach(dir => {
  const dirPath = path.join(dataPaths.sample, dir)
  const subDirs = fs.readdirSync(dirPath)

  subDirs.forEach(option => {
    const filePath = path.join(dirPath, option)
    const buffer = fs.readFileSync(filePath)
    const file = sharp(buffer)
      .resize(96)
      .grayscale()
      .trim()
      .toBuffer()
      .toString('bas64')

    trainingData.push({
      input: [file],
      output: [
        {
          option: dir
        }
      ]
    })
  })
})

console.log('\nTraining started...')

const startTime = utilities.clock()

const result = net.train(trainingData, {
  iterations: 1000,
  log: true,
  logPeriod: 100,
  learningRate: 0.01
})

const duration = utilities.clock(startTime)

console.log(
  `\nTraining finished in ${duration / 1000}s with error: ${result.error}`
)

fs.writeFileSync(dataPaths.trainingOutput, JSON.stringify(net.toJSON()))

console.log('\nTraining data exported to: ', dataPaths.trainingOutput)
