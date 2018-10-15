const sharp = require('sharp')

/**
 * Import utilty functions
 */
const {
  getRollNoFromImage,
  getQuestionsData,
  getNeuralNet,
} = require('./index')

// controls if processing is enabled
let processingEnabled = true

/**
 * Stops the current processing task
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

  processingEnabled = true
  for (let i = 0; i < imagePaths.length && processingEnabled; i += 1) {
    const sharpImage = sharp(imagePaths[i])
      .raw()
      .flatten()
    const sharpImageClone = sharpImage.clone()

    /* eslint-disable no-await-in-loop */
    const rollNo = await getRollNoFromImage(designData, sharpImage)
    const questionsData = await getQuestionsData(designData, sharpImageClone)
    /* eslint-enable no-await-in-loop */
    console.log(questionsData[0])
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
      },
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
