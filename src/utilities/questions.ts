import { DesignData } from './design'
import { Image } from './Image'
import { QuestionOptions } from './QuestionOptions'

export type AnswerCollection = {
  title: QuestionOptions
  percentage: number
}

export type QuestionData = {
  [key: string]: QuestionOptions
}

export async function getQuestionsData(
  design: DesignData,
  image: Image
): Promise<QuestionData> {
  const questions = Object.entries(design.questions)
  const questionData: QuestionData = {}

  // log image
  // logImageData(imageData, 'complete')

  for (let i = 0; i < questions.length; i += 1) {
    const [questionTitle, q] = questions[i]
    const options = Object.entries(q)
    const answerCollection: AnswerCollection[] = []
    let finalOption: QuestionOptions

    // collect % filled for all options
    for (let j = 0; j < options.length; j += 1) {
      const [optionTitle, itemInfo] = options[j]

      if (!itemInfo) continue

      // log image
      // logImageData(imageData, questionTitle + optionTitle)

      const percentBlack = image
        .extract(
          Math.floor(itemInfo.x - itemInfo.width * 0.5),
          Math.floor(itemInfo.y - itemInfo.height * 0.5),
          Math.ceil(itemInfo.width),
          Math.ceil(itemInfo.height)
        )
        .getPercentFilled()

      answerCollection.push({
        title: optionTitle as QuestionOptions,
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
      finalOption = QuestionOptions.None
    } else {
      finalOption = QuestionOptions.Multiple
    }

    questionData[questionTitle] = finalOption
  }

  return questionData
}
