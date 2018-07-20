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
 * Report progress to the parent process
 */
async function sendProgress(val) {
  if (process && process.send) {
    process.send({ progress: true, value: val })
  } else {
    console.log('progress: ', val)
  }
}

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

    const resultsJson = {
      [rollNo]: {},
    }

    for (let j = questionsData.length - 1; j >= 0; j -= 1) {
      const q = questionsData[j]
      const pre = neuralNet.run(q.data)
      let resultArray = []

      Object.keys(pre).forEach(key => {
        resultArray.push({ key, val: pre[key] })
      })
      resultArray.sort((a, b) => b.val - a.val)

      const topKeyValue = resultArray[0]
      if (topKeyValue.val >= 0.95 && topKeyValue.key === '?') {
        resultsJson[rollNo][q.title] = topKeyValue.key
      } else {
        resultArray = resultArray.filter(item => item.key !== '?')

        if (
          topKeyValue.val < 0.4 ||
          topKeyValue.val - resultArray[1].val < 0.2
        ) {
          resultsJson[rollNo][q.title] = '*'
        } else {
          resultsJson[rollNo][q.title] = topKeyValue.key
        }
      }
    }

    outputs.push(resultsJson)
    sendProgress(i)
  }

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
