const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const dataPaths = require('./data-paths')
const utilities = require('./utilities.js')

const dirs = fs.readdirSync(dataPaths.sample)
const trainingData = []

async function getDataFromImage(imgPath, option) {
  const img = sharp(imgPath)
    .resize(96, 28)
    .toColourspace('b-w')
    .threshold(32)

  const buff = await img.raw().toBuffer()

  return {
    data: buff.toJSON().data, // .join(''),
    option
  }
}

function startTraining() {
  console.log('\nTraining started...\n')

  const startTime = utilities.clock()

  // TODO: create and train network

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
      const data = item.data
      const opt = {}
      opt[item.option] = 1

      // TODO: prepare training data
    }

    startTraining()
  })

  // }
}

// Starts process
processData()
