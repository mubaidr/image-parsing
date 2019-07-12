import Result from './@classes/Result'
import IDesignData from './@interfaces/IDesignData'
import INNQuestionOutput from './@interfaces/INNQuestionOutput'
import { getRollNoFromImage, getSharpObjectFromSource } from './images'
import { getQuestionsNeuralNet } from './index'
import { getQuestionsData } from './questions'

const processTask = async (
  designData: IDesignData,
  images: string[]
): Promise<Result[] | undefined> => {
  const neuralNet = getQuestionsNeuralNet()
  const results: Result[] = []

  // loop through all images
  for (const img of images) {
    const sharpImage = getSharpObjectFromSource(img)

    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage, true),
      getQuestionsData(designData, sharpImage.clone()),
    ])
    const result = new Result(rollNo, img)

    for (const questionData of questionsData) {
      const { title, input } = questionData
      const pre = neuralNet.run<number[], INNQuestionOutput>(input)
      let value: string

      if (!title) {
        continue
      }

      if (pre['?'] >= 0.95) {
        value = '?'
      } else {
        const [first, second] = Object.entries(pre).sort((a, b) => b[1] - a[1])

        // 20% more sure than any other option
        if (first[1] - second[1] >= 0.2) {
          value = first[0]
        } else {
          value = '*'
        }
      }

      result.addAnswer(title, value)
    }

    // collect option selection
    results.push(result)

    // report progress status
    if (process && process.send) {
      process.send({
        progress: true,
      })
    }
  }

  // report completed status & exit process
  if (process && process.send) {
    process.send(
      {
        completed: true,
        results: results,
      },
      () => {
        process.exit(0)
      }
    )
  } else {
    return results
  }
}

// add message listner
process.on('message', m => {
  processTask(m.designData, m.imagePaths)
})

export { processTask }
