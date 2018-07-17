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
 * @returns {Object} Compiled result JSON
 */
async function processTask(designData, imagePaths) {
  const neuralNet = getNeuralNet()
  const promises = []

  processingEnabled = true
  for (let i = 0; i < imagePaths.length && processingEnabled; i += 1) {
    const imagePath = imagePaths[i]
    const sharpImage = sharp(imagePath)
      .raw()
      .flatten()
    const sharpImageClone = sharpImage.clone()

    const promise = new Promise(resolve => {
      Promise.all([
        getRollNoFromImage(designData, sharpImage),
        getQuestionsData(designData, sharpImageClone),
      ]).then(res => {
        const [rollNo, questionsData] = res
        const questionsCount = questionsData.length
        const resultsJson = {}

        if (!resultsJson[rollNo]) resultsJson[rollNo] = {}

        for (let j = questionsCount - 1; j >= 0; j -= 1) {
          const q = questionsData[j]
          const pre = neuralNet.run(q.data)
          let resultArray = []

          Object.keys(pre).forEach((key, index) => {
            resultArray[index] = { key, val: pre[key] }
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

        resolve(resultsJson)
      })
    })

    promises.push(promise)
  }

  // eslint-disable-next-line
  return Promise.all(promises)
    .then(res => {
      if (process && process.send) {
        process.send(
          {
            result: res,
            completed: true,
          },
          () => {
            process.exit(0)
          },
        )
      }
      return res
    })
    .catch(err => {
      process.send(
        {
          error: err,
        },
        () => {
          process.exit(1)
        },
      )
    })
}

if (process) {
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
