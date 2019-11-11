import Result from '../@classes/Result'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import QuestionOptionsEnum from '../@enums/QuestionOptionsEnum'
import WorkerTypes from '../@enums/WorkerTypes'
import NNQuestionOutput from '../@interfaces/NNQuestionOutput'
import WorkerInput from '../@interfaces/WorkerInput'
import WorkerOutput from '../@interfaces/WorkerOutput'
import { getQuestionsNeuralNet } from '../getQuestionsNeuralNet'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'
import { getRollNoFromImage } from '../sheetInfo'

function sendMessage(obj: WorkerOutput): void {
  if (process && process.send) {
    process.send(obj)
  }
}

async function start(
  msg: WorkerInput,
  isChildProcess: boolean,
): Promise<Result[] | undefined> {
  const { designData, imagePaths } = msg

  if (!designData) throw new Error('Invalid designData...')
  if (!imagePaths) throw new Error('Invalid imagePaths...')

  const neuralNet = getQuestionsNeuralNet()
  const results: Result[] = []

  for (let i = 0, imagesLength = imagePaths.length; i < imagesLength; i += 1) {
    const image = imagePaths[i]
    const sharpImage = getSharpObjectFromSource(image)
    const lastTimeSnapshot = Date.now()

    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage, true),
      getQuestionsData(designData, sharpImage.clone()),
    ])
    const result = new Result(rollNo, image)

    if (!questionsData) throw new Error('Unable to extract questions data...')

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

    if (isChildProcess) {
      sendMessage({
        state: ProgressStateEnum.PROGRESS,
        timeElapsed: Date.now() - lastTimeSnapshot,
      })
    }
  }

  if (isChildProcess) {
    sendMessage({
      state: ProgressStateEnum.COMPLETED,
      workerType: WorkerTypes.EXTRACT,
      data: results,
    })
  } else {
    return results
  }
}

function stop(): void {
  process.exit(0)
}

process.on('message', (msg: WorkerInput) => {
  if (msg.stop) {
    stop()
  } else {
    start(msg, true)
  }
})

process.on('unhandledRejection', error => {
  console.error(error)

  stop()
})

process.on('uncaughtException', error => {
  console.error(error)

  stop()
})

process.on('warning', warning => {
  console.warn(warning)
})

export default { start, stop }
