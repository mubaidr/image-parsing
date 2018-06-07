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
        let value = resultArray[0]

        if (value.val >= 0.95 && value.key === '?') {
          resultsJson[rollNo][q.title] = value.key
        } else {
          const newArray = resultArray
            .filter(item => item.key !== '?')
            .sort((a, b) => b.val - a.val)

          // eslint-disable-next-line
          value = newArray[0]

          if (
            newArray[1].val >= 0.5 ||
            newArray[0].val - newArray[1].val < 20
          ) {
            resultsJson[rollNo][q.title] = '*'
          } else {
            resultsJson[rollNo][q.title] = value.key.toUpperCase()
          }
        }
      })
    })
  }
}

async function process() {
  const designData = await getDesignData()
  const imagePaths = await getImagePaths()
  const neuralNet = await getNeuralNet()

  // const NO_OF_CPUS = os.cpus.length
  // const resultsJson = {}

  // TODO: split images collection and divide among all cores
  processTask(designData, imagePaths, neuralNet)
  // TODO: collect result from each process

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
