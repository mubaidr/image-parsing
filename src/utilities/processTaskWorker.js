const { getRollNoFromImage, getSharpObjectFromSource } = require('./images')
const { getQuestionsData } = require('./questions')
const { getQuestionsNeuralNet } = require('./index')

// sends progress to parent
async function sendProgress(p) {
  process.send(p, () => {
    if (p.completed) process.exit(0)
  })
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
  for (let i = 0; i < imagePaths.length; i += 1) {
    const startTime = Date.now()
    const img = imagePaths[i]
    const sharpImage = getSharpObjectFromSource(img).raw()

    const [result, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage),
      getQuestionsData(designData, sharpImage.clone()),
    ])

    for (let j = 0; j < questionsData.length; j += 1) {
      const { title, data } = questionsData[j]
      const pre = neuralNet.run(data)

      if (pre['?'] > 0.7) {
        result[title] = '?'
      } else {
        const [first, second] = Object.entries(pre).sort((a, b) => b[1] - a[1])

        if (
          first[1] - second[1] >= 0.3 || // 30% more sure than any other option
          (first[1] >= 0.2 && second[1] < 0.1) // only feasible option above 25%
        ) {
          ;[result[title]] = first
        } else {
          result[title] = '*'
        }
      }
    }

    // store img reference
    result.img = img

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
    completed: true,
    results,
  })
}

// add message listner
process.on('message', m => {
  processTask(m.designData, m.imagePaths)
})

module.exports = {
  processTask,
}
