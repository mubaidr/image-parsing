const { getRollNoFromImage, getSharpObjectFromSource } = require('./images')
const { getQuestionsData } = require('./questions')
const { getQuestionsNeuralNet } = require('./index')

// sends progress to parent
async function sendProgress(p) {
  if (process && process.send) {
    return process.send(p, () => {
      if (p.completed) process.exit(0)
    })
  }

  // return only key for non-wroker
  return p.results
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

      if (parseFloat(pre['?']) >= 0.95) {
        result[title] = '?'
      } else {
        const [first, second] = Object.entries(pre).sort((a, b) => b[1] - a[1])

        // TODO: test results
        // 25% more sure than any other option
        if (first[1] - second[1] >= 0.2) {
          result[title] = first[0]
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

  return sendProgress({
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
