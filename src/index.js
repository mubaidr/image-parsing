const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const sharp = require('sharp')

const dataPaths = require('./data-paths')
const utilities = require('./utilities.js')

const net = new brain.NeuralNetwork()
// const net = new brain.recurrent.RNN()
// const net = new brain.recurrent.LSTM()
// const net = new brain.recurrent.GRU()
const dirs = fs.readdirSync(dataPaths.sample)
const trainingData = []

/**
 *
 *
 * @param {any} imgPath Path to the image file
 * @param {any} option output for the image
 * @returns Raw data array of size width x height
 */
async function getDataFromImage(imgPath, option) {
  const img = sharp(imgPath)
    .resize(48, 14)
    .toColourspace('b-w')
    .threshold(32)

  const buff = await img.raw().toBuffer()
  const data = buff.toJSON().data.map(val => (val === 0 ? 1 : 0))

  // TODO: implement huffman type encoding to reduce data

  /*
  img
    .toFormat('png')
    .toFile(
      path.join(dataPaths.test, 'tmp', `${Math.random() * 100}.png`),
      err => {
        if (err) console.error('Error writing file: ', err)
      }
    )
  */

  return {
    data,
    option
  }
}

/**
 * Initiates the learning process
 *
 */
function startTraining() {
  console.log('\nTraining started...\n')

  const startTime = utilities.clock()

  const result = net.train(trainingData, {
    // iterations: 500,
    errorThresh: 0.0001,
    log: true,
    logPeriod: 1,
    activation: 'leaky-relu'
  })

  const duration = utilities.clock(startTime)

  console.log(
    `\nTraining finished in ${duration / 1000}s with training error: ${
      result.error
    }`
  )

  fs.writeFileSync(dataPaths.trainingOutput, JSON.stringify(net.toJSON()))

  console.log('\nTraining data exported to: ', dataPaths.trainingOutput)

  /*
  console.log('\nRunning test: ')

  const output = brain.likely([0, 1, 0, 0], net)

  console.log('Output should be A: ', output)
  */
}

/**
 * Prepares/pre-process image data for for input
 *
 */
function processData() {
  const promises = []
  console.log('\nPreparing training data...')

  dirs.forEach(dir => {
    const dirPath = path.join(dataPaths.sample, dir)
    const subDirs = fs.readdirSync(dirPath)

    subDirs.forEach(option => {
      const filePath = path.join(dirPath, option)

      promises.push(getDataFromImage(filePath, dir))
    })
  })

  Promise.all(promises).then(res => {
    for (let i = 0; i < res.length; i += 1) {
      const item = res[i]

      const output = {}
      output[item.option] = 1

      trainingData.push({
        input: item.data,
        output
      })
    }

    // console.dir(trainingData[0])

    startTraining()
  })
}

// Starts process
processData()
