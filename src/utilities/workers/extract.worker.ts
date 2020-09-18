// @ts-ignore
import('v8-compile-cache')

import { DesignData, QUESTION_OPTIONS } from '../design'
import { getSharpObjectFromSource } from '../images'
import { getQuestionsData, QuestionData } from '../questions'
import { Result } from '../Result'
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

function addAnswersFromData(result: Result, data: QuestionData) {
  Object.entries(data).forEach(([questionTitle, questionData]) => {
    const answersCollection: { title: QUESTION_OPTIONS; data: number }[] = []
    let finalOption: QUESTION_OPTIONS = QUESTION_OPTIONS.NONE

    Object.entries(questionData).forEach(([optionTitle, optionData]) => {
      if (optionData) {
        answersCollection.push({
          title: optionTitle as QUESTION_OPTIONS,
          data:
            optionData.reduce((prev, item) => {
              return item <= 170 ? prev + 1 : prev
            }, 0) / optionData.length,
        })
      }
    })

    answersCollection.sort((a, b) => {
      return b.data - a.data
    })

    const [first, second] = answersCollection

    if (first.data < 0.2) {
      finalOption = QUESTION_OPTIONS.NONE
    } else if (first.data - second.data < 0.2) {
      finalOption = QUESTION_OPTIONS.MULTIPLE
    } else {
      finalOption = first.title
    }

    result.addAnswer(questionTitle, finalOption)
  })
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
    results.push(result)

    if (questionsData) {
      addAnswersFromData(result, questionsData)
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
