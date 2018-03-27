const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const dataPaths = require('./data-paths')
const utilities = require('./utilities')
// const sharp = require('sharp')

// const net = new brain.NeuralNetwork({
const net = new brain.recurrent.RNN()
const dirs = fs.readdirSync(dataPaths.sample)
const trainingData = []

console.log('Preparing training data...')

dirs.forEach(dir => {
  const dirPath = path.join(dataPaths.sample, dir)
  const subDirs = fs.readdirSync(dirPath)

  subDirs.forEach((option, index) => {
    const filePath = path.join(dirPath, option)
    // const file = utilities.base64_encode(fs.readFileSync(filePath))
    const file = utilities.base64_encode(fs.readFileSync(filePath)).split('')

    trainingData.push({
      input: file,
      output: [dir]
    })
  })
})

// console.log(trainingData)

console.log('Training started...')

const result = net.train(trainingData, {
  iterations: 100,
  log: true,
  logPeriod: 1,
  timeout: 60000
})

console.log(result)

/*
  .then(status => {
    const result = net.toJSON()

    fs.writeFileSync(dataPaths.trainingOutput, JSON.stringify(result))

    console.log('Traning finished with status: ', status)
  })
  */
