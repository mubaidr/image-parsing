const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const dataPaths = require('./data-paths')
const sharp = require('sharp')
// const getPixels = require('get-pixels')

const utilities = require('./utilities.js')

// const net = new brain.NeuralNetwork()
// const net = new brain.NeuralNetworkGPU()
const net = new brain.recurrent.RNN()
const dirs = fs.readdirSync(dataPaths.sample)
const trainingData = []

console.log('\nPreparing training data...')

dirs.forEach((dir, index) => {
  const dirPath = path.join(dataPaths.sample, dir)
  const subDirs = fs.readdirSync(dirPath)

  subDirs.forEach((option, indexOption) => {
    const filePath = path.join(dirPath, option)

    // eslint-disable-next-line
    const data = getDataFromImage(filePath, index, indexOption)

    /*
    const buffer = fs.readFileSync(filePath)
    const file = sharp(buffer)
      .resize(96)
      .grayscale()
      .raw()
      .toBuffer()
      .then(buff => {
        console.log(buff.toString('base64'))
      })
    // .toString('base64')
    // .split('')

    /*
    trainingData.push({
      input: [file],
      output: { option: dir }
    })
    */
    /*
    console.log(file)
*/
    trainingData.push({
      input: [data],
      output: { option: dir }
    })
  })
})

console.log(trainingData.length)

// eslint-disable-next-line
startTraining()

function startTraining() {
  console.log('\nTraining started...\n')

  const startTime = utilities.clock()

  const result = net.train(trainingData, {
    iterations: 10,
    log: true,
    logPeriod: 1
    // timeout: 30000
    // ,learningRate: 0.9
  })

  const duration = utilities.clock(startTime)

  console.log(
    `\nTraining finished in ${duration / 1000}s with error: ${result.error}`
  )

  fs.writeFileSync(dataPaths.trainingOutput, JSON.stringify(net.toJSON()))

  console.log('\nTraining data exported to: ', dataPaths.trainingOutput)
}

async function getDataFromImage(imgPath, a, b) {
  const file = await sharp(imgPath)
    .resize(96)
    // .toColourspace('b-w')
    .threshold(32)
    // .raw()
    .toBuffer()

  fs.writeFileSync(path.join(dataPaths.test, 'tmp', `${a}-${b}.png`), file)
  // console.log(file.length)

  console.log(
    file.length,
    file[321],
    file[322],
    file[323],
    file[324],
    file[325]
  )

  return file // .toString('base64').split('')
}
