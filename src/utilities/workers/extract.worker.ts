// @ts-ignore
import('v8-compile-cache')

import { DesignData, QUESTION_OPTIONS_ENUM } from '../design'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData } from '../questions'
import Result from '../Result'
import { getRollNoFromImage } from '../sheetInfo'
import { PROGRESS_STATES } from './WorkerManager'

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
    const imagePath = imagePaths[i]
    const sharpImage = getSharpObjectFromSource(imagePath)

    // get design and image data
    const [rollNo, questionsData] = await Promise.all([
      getRollNoFromImage(designData, sharpImage),
      getQuestionsData(designData, sharpImage.clone()),
    ])
    const result = new Result(rollNo, imagePath)

    if (questionsData === undefined) {
      result.error = 'Image is not in correct format!'
    } else {
      Object.entries(questionsData).forEach(
        ([questionTitle, optionsDataCollection]) => {
          Object.entries(optionsDataCollection).forEach(
            ([optionTitle, optionsData]) => {
              //TODO: determine if option is checked using optionsData

              result.addAnswer(questionTitle, QUESTION_OPTIONS_ENUM.NONE)
            }
          )
        }
      )
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
