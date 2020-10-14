import 'v8-compile-cache'
import { DesignData } from '../design'
import { getImageDataFromSource } from '../images'
import { getQuestionsData } from '../questions'
import { Result } from '../Result'
import { getSheetInfoFromImage } from '../sheetInfo'
import { ProgressStates } from './ProgressStates'

export type WorkerExtractInputMessage = {
  designData: DesignData
  imagePaths: string[]
}

export type WorkerExtractOutputMessage = {
  progressState: ProgressStates
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
    const imagePath = imagePaths[i]
    const imageData = await getImageDataFromSource(imagePath)

    // get design and image data
    const [rollNo, questionsData] = await Promise.all([
      getSheetInfoFromImage(designData, imageData),
      getQuestionsData(designData, imageData.clone()),
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
        progressState: ProgressStates.Progress,
      })
    }
  }

  if (isWorker) {
    sendMessage({
      progressState: ProgressStates.Complete,
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
