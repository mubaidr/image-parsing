const fs = require('fs')
const os = require('os')
const sharp = require('sharp')

const {
  getDesignData,
  getImagePaths,
  getNeuralNet,
  getRollNoFromImage,
  jsonToCsv,
} = require(`${global.__paths.utilities}`) // eslint-disable-line

async function prepareInputData(designData, path) {
  return new Promise((resolve, reject) => {
    const PROMISES = []

    const img = sharp(path)
      .resize(designData.width)
      .max()
      .raw()
      .toColourspace('b-w')
      .threshold(32)

    // extract all questions portions
    Object.keys(designData.questions).forEach(title => {
      const p = new Promise((resolve, reject) => {
        const q = designData.questions[title]

        img
          .extract({
            left: q.x1 - 10,
            top: q.y1 - 10,
            width: q.x2 - q.x1 + 10,
            height: q.y2 - q.y1 + 10,
          })
          .toBuffer()
          .then(buff => {
            const data = buff.toJSON().data // .map(val => (val === 0 ? 1 : 0))

            resolve({
              title,
              data,
            })
          })
      })

      PROMISES.push(p)
    })

    Promise.all(PROMISES).then(res => {
      resolve(res)
    })
  })
}

async function process() {
  const designData = await getDesignData()
  const imagePaths = await getImagePaths()
  const neuralNet = await getNeuralNet()

  const NO_OF_CPUS = os.cpus.length
  const RESULTS_JSON = {}

  for (let i = 0; i < imagePaths.length; i += 1) {
    const imagePath = imagePaths[i]
    const rollNo = await getRollNoFromImage(imagePath, designData)

    prepareInputData(designData, imagePath).then(output => {
      if (!RESULTS_JSON[rollNo]) RESULTS_JSON[rollNo] = {}

      output.forEach(q => {
        const pre = neuralNet(q.data)
        const resultArray = []

        Object.keys(pre).forEach((key, index) => {
          resultArray[index] = {
            key,
            val: pre[key],
          }
        })

        resultArray.sort((a, b) => b.val - a.val)
        let value = resultArray[0]

        if (value.val >= 0.95 && value.key === '?') {
          RESULTS_JSON[rollNo][q.title] = value.key
        } else {
          const newArray = resultArray
            .filter(item => item.key !== '?')
            .sort((a, b) => b.val - a.val)

          value = newArray[0]

          if (
            newArray[1].val >= 0.5 ||
            newArray[0].val - newArray[1].val < 20
          ) {
            RESULTS_JSON[rollNo][q.title] = '*'
          } else {
            RESULTS_JSON[rollNo][q.title] = value.key.toUpperCase()
          }
        }
      })
    })
  }

  fs.writeFileSync(
    `${global.__paths.trainingData}\\data-output.json`,
    JSON.stringify(RESULTS_JSON)
  )

  fs.writeFileSync(
    `${global.__paths.trainingData}\\data-output.csv`,
    jsonToCsv(RESULTS_JSON)
  )

  console.log(
    '\nResult data exported to: ',
    `${global.__paths.trainingData}, Result: \n`,
    RESULTS_JSON
  )
}

module.exports = {
  process,
}
