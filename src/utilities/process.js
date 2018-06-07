const os = require('os')

const {
  getDesignData,
  getImagePaths,
  getNeuralNet,
  getRollNoFromImage,
  getQuestionsData,
} = require('./index')

async function processTask(designData, imagePaths, neuralNet) {
  const resultsJson = {}

  for (let i = 0; i < imagePaths.length; i += 1) {
    const imagePath = imagePaths[i]
    // eslint-disable-next-line
    const rollNo = await getRollNoFromImage(imagePath, designData)

    getQuestionsData(designData, imagePath).then(output => {
      if (!resultsJson[rollNo]) resultsJson[rollNo] = {}

      output.forEach(q => {
        const pre = neuralNet(q.data)
        const resultArray = []

        Object.keys(pre).forEach((key, index) => {
          resultArray[index] = { key, val: pre[key] }
        })
        resultArray.sort((a, b) => b.val - a.val)

        let topKeyValue = resultArray[0]

        if (topKeyValue.val >= 0.95 && topKeyValue.key === '?') {
          resultsJson[rollNo][q.title] = topKeyValue.key
        } else {
          const newArray = resultArray.filter(item => item.key !== '?')

          // eslint-disable-next-line
          topKeyValue = newArray[0]

          if (topKeyValue.val < 0.5 || topKeyValue.val - newArray[1].val < 20) {
            resultsJson[rollNo][q.title] = '*'
          } else {
            resultsJson[rollNo][q.title] = topKeyValue.key.toUpperCase()
          }
        }
      })
    })
  }
}

async function process() {
  const [designData, imagePaths, neuralNet] = await Promise.all([
    getDesignData(),
    getImagePaths(),
    getNeuralNet(),
  ])

  const NO_OF_CORES = os.cpus.length * 2 // use hyper-threading
  const TOTAL_IMAGES = imagePaths.length
  const promises = []

  // const resultsJson = {}

  for (let i = 0; i < NO_OF_CORES; i += 1) {
    const startIndex = Math.floor(i * (TOTAL_IMAGES / NO_OF_CORES))
    const endIndex =
      i < NO_OF_CORES
        ? Math.floor((i + 1) * (TOTAL_IMAGES / NO_OF_CORES))
        : TOTAL_IMAGES - 1

    promises.push(
      processTask(designData, imagePaths.slice(startIndex, endIndex), neuralNet)
    )
  }

  Promise.all(promises).then(res => {
    // DEBUG: Should contain json parts equal to NO_OF_CORES
    console.log(res)
  })

  /*
  fs.writeFileSync(
    `${appPaths.trainingData}\\data-output.json`,
    JSON.stringify(resultsJson)
  )

  fs.writeFileSync(
    `${appPaths.trainingData}\\data-output.csv`,
    jsonToCsv(resultsJson)
  )
  */
}

module.exports = {
  process,
}
