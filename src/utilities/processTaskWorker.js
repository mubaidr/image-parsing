const sharp = require('sharp')

const { getRollNoFromImage } = require('./images')
const { getQuestionsData } = require('./questions')
const { getQuestionsNeuralNet } = require('./index')

// controls if processing is enabled
let processingEnabled = true

/**
 * Set Start status to the current processing task
 */
function start() {
  processingEnabled = true
}

// stops process in immediate next loop
function stop() {
  processingEnabled = false

  process.exit(0)
}

// sends progress to parent
async function sendProgress(p) {
  if (process && process.send) {
    process.send(p, () => {
      if (p.completed) stop()
    })
  } else {
    console.log('Results: ', p)
  }
}

/**
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {Array.<String>} imagePaths List of scanned images paths
 *
 * @returns {Object} Extracted result JSON
 */
async function processTask(designData, imagePaths) {
  const neuralNet = getQuestionsNeuralNet()
  const results = []

  // loop through all images
  for (let i = 0; i < imagePaths.length && processingEnabled; i += 1) {
    const startTime = Date.now()
    const sharpImage = sharp(imagePaths[i])
      .raw()
      .flatten()
    const sharpImageClone = sharpImage.clone()

    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage),
      getQuestionsData(designData, sharpImageClone),
    ])

    // prepare output
    const result = {
      rollNo,
    }

    for (let j = questionsData.length - 1; j >= 0; j -= 1) {
      const { title, data } = questionsData[j]
      const pre = neuralNet.run(data)

      if (pre['?'] >= 0.95) {
        result[title] = '?'
      } else {
        const [first, second] = Object.entries(pre).sort((a, b) => b[1] - a[1])

        if (first[1] - second[1] >= 0.33) {
          ;[result[title]] = first
        } else {
          result[title] = '*'
        }
      }
    }

    // collect option selection
    results.push(result)

    // report progress status
    sendProgress({
      progress: true,
      time: Date.now() - startTime,
    })
  }

  // report completed status & exit process
  sendProgress({
    results,
    completed: true,
  })
}

// add message listner
if (process && process.send) {
  process.on('message', m => {
    if (m && m.stop) {
      stop()
    } else {
      start()
      processTask(m.designData, m.imagePaths)
    }
  })
}

module.exports = {
  processTask,
  stop,
}
