// @ts-ignore
import('v8-compile-cache')

import { parentPort } from 'worker_threads'
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
  if (parentPort) {
    parentPort.postMessage(message)
  }
}

function toGreyScaledBinary(data: number[]): number[] {
  const binaryData: number[] = []
  const channels = 3

  for (let i = 0; i < data.length; i += channels) {
    const threshold = 15
    const thresholdBlack = 80
    const [r, g, b] = data.slice(i, i + channels)
    const avg = Math.ceil((r + g + b) / channels)
    const upperLimit = avg + threshold
    const lowerLimit = avg - threshold

    if (avg <= thresholdBlack) {
      // Black pixel
      binaryData.push(1)
    } else if (
      r <= upperLimit &&
      r >= lowerLimit &&
      g <= upperLimit &&
      g >= lowerLimit &&
      b <= upperLimit &&
      b >= lowerLimit
    ) {
      // Grey pixel
      binaryData.push(0)
    } else {
      // Color pixel
      binaryData.push(1)
    }
  }

  return binaryData
}

function addAnswersFromData(result: Result, data: QuestionData) {
  Object.entries(data).forEach(([questionTitle, questionData]) => {
    const answersCollection: {
      title: QUESTION_OPTIONS
      percentage: number
    }[] = []
    let finalOption: QUESTION_OPTIONS = QUESTION_OPTIONS.NONE

    Object.entries(questionData).forEach(([optionTitle, optionData]) => {
      if (optionData === undefined) return

      const greyScaledBinary = toGreyScaledBinary(optionData)
      const percentBlack =
        greyScaledBinary.reduce((prev, item) => prev + item, 0) /
        (greyScaledBinary.length / 100)

      answersCollection.push({
        title: optionTitle as QUESTION_OPTIONS,
        percentage: percentBlack,
      })
    })

    answersCollection.sort((a, b) => {
      return b.percentage - a.percentage
    })

    const [first, second] = answersCollection

    // if (second.percentage > 0) {
    //   console.log(`${result.rollNo} ${questionTitle}`, first, second)
    // }

    if (first.percentage > 8 && first.percentage - second.percentage * 2 > 0) {
      finalOption = first.title
    } else if (first.percentage < 16) {
      finalOption = QUESTION_OPTIONS.NONE
    } else {
      finalOption = QUESTION_OPTIONS.MULTIPLE
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
  } else {
    return results
  }
}

if (parentPort) {
  parentPort.on('message', (payload: WorkerExtractInputMessage) => {
    start(payload)
  })
}
