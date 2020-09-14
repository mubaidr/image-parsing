import { Sharp } from 'sharp'
import { DesignData } from './workers/WorkerManager'

// enum QuestionPaperTypeEnum {
//   A = 'A',
//   B = 'B',
//   C = 'C',
//   D = 'D',
//   E = 'E',
//   F = 'F',
//   G = 'G',
//   I = 'I',
//   J = 'J',
//   K = 'K',
//   L = 'L',
// }

export enum QuestionOptionsEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  MULTIPLE = '*',
  NONE = '?',
}

export interface QuestionData {
  title: string
  data: number[]
}

export async function getQuestionsData(
  design: DesignData,
  img: Sharp
): Promise<QuestionData[]> {
  const { width } = await img.metadata()
  const scale = width && width > design.width ? design.width / width : 1
  const extractedQuestionData: QuestionData[] = []
  const questions = Object.entries(design.questions)

  if (scale !== 1) img.resize(Math.floor(design.width * scale))

  for (let i = 0; i < questions.length; i += 1) {
    const [title, q] = questions[i]

    img.extract({
      left: Math.floor(q.x * scale),
      top: Math.floor(q.y * scale),
      width: Math.ceil(q.width * scale),
      height: Math.ceil(q.height * scale),
    })

    // log image
    // logImageData(img, title)

    const buffer = await img.toBuffer()

    extractedQuestionData.push({
      title,
      data: [...buffer],
    })
  }

  return extractedQuestionData
}
