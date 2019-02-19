const sharp = require('sharp')

const { getRollNoFromImage } = require('./images')
const { getQuestionsData } = require('./questions')
const { getNeuralNet } = require('./index')

// controls if processing is enabled
let processingEnabled = true

/**
 * Set Start status to the current processing task
 */
function start() {
  processingEnabled = true
}

/**
 * Set Stop status to the current processing task
 */
function stop() {
  processingEnabled = false
}

/**
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {Array.<String>} imagePaths List of scanned images paths
 *
 * @returns {Object} Extracted result JSON
 */
async function processTask(designData, imagePaths) {
  const neuralNet = getNeuralNet()
  const outputs = []

  // processing state
  start()

  // loop through all images
  for (let i = 0; i < imagePaths.length && processingEnabled; i += 1) {
    const sharpImage = sharp(imagePaths[i])
      .raw()
      .flatten()
    const sharpImageClone = sharpImage.clone()

    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage),
      getQuestionsData(designData, sharpImageClone),
    ])

    // prepare output
    const resultsJson = {
      [rollNo]: {},
    }

    for (let j = questionsData.length - 1; j >= 0; j -= 1) {
      const q = questionsData[j]
      const pre = neuralNet.run(q.data)

      if (pre['?'] >= 0.95) {
        resultsJson[rollNo][q.title] = '?'
      } else {
        const [first, second] = Object.entries(pre)
          .filter(([key]) => key !== '?')
          .sort((a, b) => b[1] - a[1])

        if (first[1] - second[1] >= 0.33) {
          ;[resultsJson[rollNo][q.title]] = first
        } else {
          resultsJson[rollNo][q.title] = '*'
        }

        // TODO: disable verification data for now
        /*
        if (first[1] - second[1] <= 0.16) {
          resultsJson[rollNo][q.title] = '*'
        } else {
          // verification required
          process.send({
            verify: true,
            rollNo,
            q,
          })
        }
        */
      }

      // TODO: test without neural network
      // console.log(
      //   resultsJson[rollNo][q.title],
      //   q.data.reduce((res, pixel) => {
      //     return (res + pixel) / 2
      //   }, 0)
      // )
    }

    // collect option selection
    outputs.push(resultsJson)

    // report progress status
    if (process && process.send) {
      process.send({ progress: true })
    } else {
      console.log('progress: ', i)
    }
  }

  // report completed status & exit process
  if (process && process.send) {
    process.send(
      {
        result: outputs,
        completed: true,
      },
      () => {
        process.exit(0)
      }
    )
  } else {
    console.log('Results: ', outputs)
  }
}

// add message listner
if (process && process.send) {
  process.on('message', m => {
    if (m && m.stop) {
      stop()
    } else {
      processTask(m.designData, m.imagePaths)
    }
  })
}

module.exports = {
  processTask,
  stop,
}
