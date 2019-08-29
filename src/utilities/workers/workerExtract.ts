import Result from '../@classes/Result'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import QuestionOptionsEnum from '../@enums/QuestionOptionsEnum'
import DesignData from '../@interfaces/DesignData'
import NNQuestionOutput from '../@interfaces/NNQuestionOutput'
import WorkerInput from '../@interfaces/WorkerInput'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsNeuralNet } from '../index'
import { getQuestionsData } from '../questions'
import { getRollNoFromImage } from '../sheetInfo'

function stop(): void {
  process.exit(0)
}

const start = async (
  designData: DesignData,
  imagePaths: string[]
): Promise<void> => {
  const neuralNet = getQuestionsNeuralNet()
  const results: Result[] = []
  let lastTimeSnapshot = Date.now()

  for (let i = 0, imagesLength = imagePaths.length; i < imagesLength; i += 1) {
    const image = imagePaths[i]
    const sharpImage = getSharpObjectFromSource(image).raw()

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

      if (!title) continue

      const pre = neuralNet.run<number[], NNQuestionOutput>(input)
      let value: string

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
      const _timeElapsed = Date.now() - lastTimeSnapshot
      lastTimeSnapshot = Date.now()

      process.send({
        state: ProgressStateEnum.PROGRESS,
        timeElapsed: _timeElapsed,
      })
    }
  }

  // report progress status
  if (process && process.send) {
    process.send(
      {
        state: ProgressStateEnum.COMPLETED,
        data: results,
      },
      stop
    )
  }
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    if (!msg.designData) throw 'Invalid design data...'
    if (!msg.imagePaths) throw 'Invalid imagesDirectory...'

    start(msg.designData, msg.imagePaths)
  }
})

process.on('unhandledRejection', e => console.error(e))
process.on('uncaughtException', e => console.error(e))
process.on('warning', e => console.warn(e))

export { start, stop }
