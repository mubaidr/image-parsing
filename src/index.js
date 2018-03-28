const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const sharp = require('sharp')

const dataPaths = require('./data-paths')
const utilities = require('./utilities.js')

const net = new brain.recurrent.RNN()
const dirs = fs.readdirSync(dataPaths.sample)
const trainingData = []

async function getDataFromImage(imgPath, option) {
  const img = sharp(imgPath)
    .resize(96, 28)
    .toColourspace('b-w')
    .threshold(32)

  const buff = await img.raw().toBuffer()

  // console.log(buff.length)

  const rawData = buff.toJSON().data
  const result = {}
  let last = null
  let count = 0

  for (let i = 0; i < rawData.length; i += 1) {
    const item = rawData[i]

    if (item === last) {
      count += 1
    } else {
      if (i !== 0) {
        result[Object.keys(result).length] = count
      }

      last = item
      count = 1
    }
  }

  // console.log('----', result)

  /*
  img
    .toFormat('png')
    .toFile(path.join(dataPaths.test, 'tmp', `${Math.random()}.png`), err => {
      if (err) console.error('Error writing file: ', err)
    })
  */

  return {
    data: result, // buff.toJSON().data.join(''),
    option
  }
}

function startTraining() {
  console.log('\nTraining started...\n')

  const startTime = utilities.clock()

  const result = net.train(trainingData, {
    iterations: 1000,
    log: true,
    logPeriod: 100,
    activation: 'leaky-relu'
  })

  const duration = utilities.clock(startTime)

  console.log(
    `\nTraining finished in ${duration / 1000}s with error: ${result.error}`
  )

  fs.writeFileSync(dataPaths.trainingOutput, JSON.stringify(net.toJSON()))

  console.log('\nTraining data exported to: ', dataPaths.trainingOutput)
}

function processData() {
  const promises = []
  console.log('\nPreparing training data...')

  // for (let i = 0; i < 1; i += 1) {

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

      const opt = {}
      opt[item.option] = 1

      trainingData.push({
        input: [item.data],
        output: [opt]
      })
    }

    // TODO: Use same images multiple times in each option
    // console.log(trainingData[0].input[0])

    startTraining()
  })

  // }
}

// Starts process
processData()
