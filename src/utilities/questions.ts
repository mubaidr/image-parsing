import { kernel, Sharp } from 'sharp'
import { DesignData } from './design'
// import { logImageData } from './images'
import { QUESTION_OPTIONS } from './QUESTION_OPTIONS'

export type AnswerCollection = {
  title: QUESTION_OPTIONS
  percentage: number
}

export type QuestionData = {
  [key: string]: QUESTION_OPTIONS
}

function getPercentFilledFromBinary(data: number[]): number {
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

  const percentageBlack =
    binaryData.reduce((prev, item) => prev + item, 0) /
    (binaryData.length / 100)

  return percentageBlack
}

export async function getQuestionsData(
  design: DesignData,
  sharpImage: Sharp
): Promise<QuestionData> {
  const { width } = await sharpImage.metadata()
  const scale = width && width > design.width ? design.width / width : 1
  // const scale = width && width > design.width ? width / design.width : 1
  const questions = Object.entries(design.questions)
  const questionData: QuestionData = {}

  if (scale !== 1) {
    sharpImage.resize(Math.ceil(design.width * scale), null, {
      kernel: kernel.nearest,
    })
  }

  for (let i = 0; i < questions.length; i += 1) {
    const [questionTitle, q] = questions[i]
    const options = Object.entries(q)
    const answerCollection: AnswerCollection[] = []
    let finalOption: QUESTION_OPTIONS

    // collect % filled for all options
    for (let j = 0; j < options.length; j += 1) {
      const [optionTitle, itemInfo] = options[j]

      if (itemInfo === undefined) continue

      sharpImage.extract({
        left: Math.floor((itemInfo.x - itemInfo.width * 0.5) * scale),
        top: Math.floor((itemInfo.y - itemInfo.height * 0.5) * scale),
        width: Math.ceil(itemInfo.width * scale),
        height: Math.ceil(itemInfo.height * scale),
      })

      // log image
      // logImageData(sharpImage, questionTitle + optionTitle)

      const percentBlack = getPercentFilledFromBinary([
        ...(await sharpImage.toBuffer()),
      ])

      answerCollection.push({
        title: optionTitle as QUESTION_OPTIONS,
        percentage: percentBlack,
      })
    }

    // determine option by comparing % filled
    const [first, second] = answerCollection.sort((a, b) => {
      return b.percentage - a.percentage
    })

    if (first.percentage > 8 && first.percentage - second.percentage * 2 > 0) {
      finalOption = first.title
    } else if (first.percentage < 16) {
      finalOption = QUESTION_OPTIONS.NONE
    } else {
      finalOption = QUESTION_OPTIONS.MULTIPLE
    }

    questionData[questionTitle] = finalOption
  }

  return questionData
}
