import { DesignData } from '../design'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'
import { Result } from '../Result'
import { getRollNoFromImage } from '../sheetInfo'
import { PROGRESS_STATES } from './PROGRESS_STATES'

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

  console.log('log data...')
  console.error('error data...')

  for (let i = 0; i < imagePaths.length; i += 1) {
    const imagePath = imagePaths[i]
    const sharpImage = getSharpObjectFromSource(imagePath)

    // get design and image data
    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage),
      getQuestionsData(designData, sharpImage.clone()),
    ])
    const result = new Result(rollNo, imagePath)
    results.push(result)

    if (questionsData) {
      Object.entries(questionsData).forEach(([questionTitle, finalOption]) => {
        result.addAnswer(questionTitle, finalOption)
      })
    } else {
      result.error = 'Image is not in correct format!'
    }

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
  } else {
    return results
  }
}

if (process && process.send) {
  process.on('message', (payload: WorkerExtractInputMessage) => {
    start(payload)
  })
}
