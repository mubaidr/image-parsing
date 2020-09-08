import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'
import Result from '../Result'
import { getRollNoFromImage } from '../sheetInfo'
import { DesignData, PROGRESS_STATES } from './WorkerManager'

export type WorkerExtractInputMessage = {
  designData: DesignData
  imagePaths: string[]
}

export type WorkerExtractOutputMessage = {
  progressState: PROGRESS_STATES
  payload?: Result[]
}

function sendMessage(message: WorkerExtractOutputMessage): void {
  if (process && process.send) {
    process.send(message)
  }
}

export async function start(
  message: WorkerExtractInputMessage,
  isWorker = true
): Promise<Result[] | undefined> {
  const { designData, imagePaths } = message
  const results: Result[] = []

  for (let i = 0; i < imagePaths.length; i += 1) {
    const image = imagePaths[i]
    const sharpImage = getSharpObjectFromSource(image)

    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage),
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

      // TODO: calculate value using area average
      const value = 'A'

      result.addAnswer(title, value)
    }

    results.push(result)

    if (isWorker) {
      sendMessage({
        progressState: PROGRESS_STATES.PROGRESS,
      })
    }
  }

  if (isWorker) {
    sendMessage({
      progressState: PROGRESS_STATES.COMPLETE,
      payload: results,
    })

    process.exit(0)
  } else {
    return results
  }
}

process.on('message', (message: WorkerExtractInputMessage) => {
  start(message)
})

process.on('unhandledRejection', (error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})

process.on('warning', (warning) => {
  // eslint-disable-next-line no-console
  console.warn(warning)
})
