import Result from './@classes/Result'
import ProgressStateEnum from './@enums/ProgressStateEnum'
import QuestionOptionsEnum from './@enums/QuestionOptionsEnum'
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
    const startTime = Date.now()
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

      if (pre[QuestionOptionsEnum.NONE] >= 0.95) {
        value = QuestionOptionsEnum.NONE
      } else {
        const [first, second] = Object.entries(pre).sort((a, b) => b[1] - a[1])

        // 20% more sure than any other option
        if (first[1] - second[1] >= 0.2) {
          value = first[0]
        } else {
          value = QuestionOptionsEnum.MULTIPLE
        }
      }

      result.addAnswer(title, value)
    }

    results.push(result)

    // report progress status
    if (process && process.send) {
      process.send({
        state: ProgressStateEnum.RUNNING,
        time: Date.now() - startTime,
      })
    }
  }

  // report completed status & exit process
  if (process && process.send) {
    process.send({
      state: ProgressStateEnum.COMPLETED,
      results: results,
    })
  } else {
    return results
  }
}

// add message listner
process.on('message', m => {
  processTask(m.designData, m.imagePaths)
})

export { processTask }
