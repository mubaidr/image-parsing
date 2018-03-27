const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const dataPaths = require('../src/data-paths')
const sharp = require('sharp')

// const net = new brain.NeuralNetwork()
const net = new brain.recurrent.RNN()
const data = fs.readFileSync(dataPaths.trainingOutput)

console.log('\nLoading net from existing data...')

net.fromJSON(JSON.parse(data))

console.log('\nRunning tests...')

const dirs = fs.readdirSync(dataPaths.test)
const result = []

dirs.forEach(dir => {
  const dirPath = path.join(dataPaths.test, dir)
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

    const output = net.runInput(file)

    result.push({
      input: dir,
      output
    })
  })
})

console.log('\nResults: ', result)

fs.writeFileSync(dataPaths.resultsOutput, JSON.stringify(result))

console.log('\nResults have been saved to: ', dataPaths.resultsOutput)
