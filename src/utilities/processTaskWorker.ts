import CompiledResult from './@classes/CompiledResult'
import IDesignData from './@interfaces/IDesignData'
import INNQuestionOutput from './@interfaces/INNQuestionOutput'
import { getRollNoFromImage, getSharpObjectFromSource } from './images'
import { getQuestionsNeuralNet } from './index'
import { getQuestionsData } from './questions'

const processTask = async (
  designData: IDesignData,
  images: string[]
): Promise<CompiledResult[] | undefined> => {
  const neuralNet = getQuestionsNeuralNet()
  const compiledResult: CompiledResult[] = []

  // loop through all images
  for (const img of images) {
    const startTime = Date.now()
    const sharpImage = getSharpObjectFromSource(img)

    const [result, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage, true),
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

        // 20% more sure than any other option
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
    compiledResult.push(result)

    // report progress status
    if (process && process.send) {
      process.send({
        progress: true,
        time: Date.now() - startTime,
      })
    }
  }

  // report completed status & exit process
  if (process && process.send) {
    process.send(
      {
        completed: true,
        results: compiledResult,
      },
      () => {
        process.exit(0)
      }
    )
  } else {
    return compiledResult
  }
}

// add message listner
process.on('message', m => {
  processTask(m.designData, m.imagePaths)
})

export { processTask }
