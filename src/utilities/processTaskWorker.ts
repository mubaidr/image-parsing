import ICodeScan from './@interfaces/ICodeScan'
import IDesignData from './@interfaces/IDesignData'
import INNQuestionOutput from './@interfaces/INNQuestionOutput'
import { getRollNoFromImage, getSharpObjectFromSource } from './images'
import { getQuestionsNeuralNet } from './index'
import { getQuestionsData } from './questions'

// sends progress to parent
async function sendProgress(p: {
  progress?: boolean
  completed?: boolean
  time?: number
  results?: ICodeScan[]
}) {
  if (process && process.send) {
    return process.send(p, () => {
      if (p.completed) {
        process.exit(0)
      }
    })
  }

  // return only key for non-wroker
  return p.results
}

type processTaskGetter = (
  designData: IDesignData,
  imagePaths: string[]
) => Promise<void>

const processTask: processTaskGetter = async (designData, imagePaths) => {
  const neuralNet = getQuestionsNeuralNet()
  const results = []

  // loop through all images
  for (const img of imagePaths) {
    const startTime = Date.now()
    const sharpImage = getSharpObjectFromSource(img)

    const [result, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage, false),
      getQuestionsData(designData, sharpImage.clone()),
    ])

    for (const questionData of questionsData) {
      const { title, input } = questionData
      const pre = neuralNet.run<number[], INNQuestionOutput>(input)

      if (!title) {
        continue
      }

      if (pre['?'] >= 0.95) {
        result[title] = '?'
      } else {
        const [first, second] = Object.entries(pre).sort((a, b) => b[1] - a[1])

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
  sendProgress({
    completed: true,
    results,
  })
}

// add message listner
process.on('message', m => {
  processTask(m.designData, m.imagePaths)
})

export { processTask }
