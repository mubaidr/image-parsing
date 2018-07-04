const sharp = require('sharp')

/**
 * Import utilty functions
 */
const {
  getRollNoFromImage,
  getQuestionsData,
  getNeuralNet,
} = require('./index')

/**
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {Array.<String>} imagePaths List of scanned images paths
 *
 * @returns {Object} Compiled result JSON
 */
async function processTask(designData, imagePaths) {
  // TODO: move this outside, once train module is fixed
  const neuralNet = getNeuralNet()
  const promises = []

  for (let i = 0; i < imagePaths.length; i += 1) {
    const imagePath = imagePaths[i]
    const sharpImage = sharp(imagePath).raw() // TODO: Preprocess image
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
            resultArray[index] = {
              key,
              val: pre[key],
            }
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
        process.send(res)
        process.exit(0)
      }
      return res
    })
    .catch(err => {
      console.log(err)
      process.exit(1)
    })
}

process.on('message', m => {
  processTask(m.designData, m.imagePaths)
})

module.exports = {
  processTask,
}
