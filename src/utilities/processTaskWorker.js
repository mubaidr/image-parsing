/**
 * Import utilty functions
 */
const {
  getRollNoFromImage,
  getQuestionsData,
  // readJsonToCsv,
} = require('./index')

/**
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {Array.<String>} imagePaths List of scanned images paths
 * @param {Function} neuralNet Trained neural network function (available from utiltities/getneuralNet)
 *
 * @returns {Object} Compiled result JSON
 */
async function processTask(designData, imagePaths, neuralNet) {
  const promises = []

  for (let i = 0; i < imagePaths.length; i += 1) {
    const imagePath = imagePaths[i]

    const promise = new Promise(resolve => {
      Promise.all([
        getRollNoFromImage(designData, imagePath),
        getQuestionsData(designData, imagePath),
      ]).then(res => {
        const [rollNo, questionsData] = res
        const resultsJson = {}

        if (!resultsJson[rollNo]) resultsJson[rollNo] = {}

        questionsData.forEach(q => {
          const pre = neuralNet.run(q.data)
          const resultArray = []

          Object.keys(pre).forEach((key, index) => {
            resultArray[index] = {
              key,
              val: pre[key],
            }
          })
          resultArray.sort((a, b) => b.val - a.val)

          let topKeyValue = resultArray[0]

          if (topKeyValue.val >= 0.95 && topKeyValue.key === '?') {
            resultsJson[rollNo][q.title] = topKeyValue.key
          } else {
            const newArray = resultArray.filter(item => item.key !== '?')

            // eslint-disable-next-line
            topKeyValue = newArray[0]

            if (
              topKeyValue.val < 0.4 ||
              topKeyValue.val - newArray[1].val < 0.2
            ) {
              resultsJson[rollNo][q.title] = '*'
            } else {
              resultsJson[rollNo][q.title] = topKeyValue.key.toUpperCase()
            }
          }
        })

        resolve(resultsJson)
      })
    })

    promises.push(promise)
  }

  Promise.all(promises).then(res => {
    process.send(res)
    process.exit()
  })
}

process.on('message', m => {
  processTask(m.designData, m.imagePaths, m.neuralNet)
})

module.exports = {
  processTask,
}
