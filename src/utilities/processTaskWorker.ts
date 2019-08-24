import Result from './@classes/Result'
import ProgressStateEnum from './@enums/ProgressStateEnum'
import QuestionOptionsEnum from './@enums/QuestionOptionsEnum'
import DesignData from './@interfaces/DesignData'
import NNQuestionOutput from './@interfaces/NNQuestionOutput'
import { getSharpObjectFromSource } from './images'
import { getQuestionsNeuralNet } from './index'
import { getQuestionsData } from './questions'
import { getRollNoFromImage } from './sheetInfo'

const processTask = async (
  designData: DesignData,
  images: string[]
): Promise<Result[] | undefined> => {
  const neuralNet = getQuestionsNeuralNet()
  const results: Result[] = []

  for (let i = 0, imagesLength = images.length; i < imagesLength; i += 1) {
    const image = images[i]
    const sharpImage = getSharpObjectFromSource(image).raw()
    const startTime = Date.now()

    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage, true),
      getQuestionsData(designData, sharpImage.clone()),
    ])
    const result = new Result(rollNo, image)

    for (
      let j = 0, questionsDataLength = questionsData.length;
      j < questionsDataLength;
      j += 1
    ) {
      const { title, input } = questionsData[j]

      if (!title) {
        continue
      }

      let value: string
      const pre = neuralNet.run<number[], NNQuestionOutput>(input)

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

process.on('warning', warning => {
  console.error(warning)
})

export { processTask }
