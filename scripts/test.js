const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const dataPaths = require('../src/data-paths')

const net = new brain.NeuralNetwork()
const data = fs.readFileSync(dataPaths.trainingOutput)

console.log('Loading net from existing data...')
net.fromJSON(JSON.parse(data))

console.log('Running tests...')

const dirs = fs.readdirSync(dataPaths.test)
const result = []

dirs.forEach(dir => {
  const dirPath = path.join(dataPaths.test, dir)
  const subDirs = fs.readdirSync(dirPath)

  subDirs.forEach(option => {
    const filePath = path.join(dirPath, option)
    const buffer = fs.readFileSync(filePath)
    const output = net.runInput(buffer.toJSON().data)

    result.push({
      input: dir,
      output
    })
  })
})

fs.writeFileSync(dataPaths.resultsOutput, JSON.stringify(result))

console.log('Results saved to output folder.')
