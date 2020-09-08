import { Sharp } from 'sharp'
import CompiledResult from './CompiledResult'
import { convertToBitArray } from './convertToBitArray'
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
  input: number[]
  output?: {
    [x: string]: number
  }
  title?: string
}

export async function getQuestionsData(
  design: DesignData,
  img: Sharp,
  compiledResult?: CompiledResult
): Promise<QuestionData[]> {
  const { width } = await img.metadata()
  const scale = width && width > design.width ? design.width / width : 1
  const extractedQuestionData: QuestionData[] = []
  const questions = Object.entries(design.questions)

  if (scale !== 1) {
    img.resize(Math.floor(design.width * scale))
  }

  for (
    let i = 0, questionsLength = questions.length;
    i < questionsLength;
    i += 1
  ) {
    const [title, q] = questions[i]
    const titleLowerCase = title.toLowerCase()

    img.extract({
      left: Math.floor(q.x * scale),
      top: Math.floor(q.y * scale),
      width: Math.ceil(q.width * scale),
      height: Math.ceil(q.height * scale),
    })

    // log image
    // logImageData(img, title)

    const { data, info } = await img.toBuffer({ resolveWithObject: true })

    // console.log(info)

    const bitData = convertToBitArray(
      Array.prototype.slice.call(data, 0),
      info.channels
    )

    if (compiledResult) {
      // for training purpose
      const result = compiledResult.getKeys()[0].answers

      if (result[titleLowerCase].value !== QuestionOptionsEnum.MULTIPLE) {
        extractedQuestionData.push({
          input: bitData,
          output: { [result[titleLowerCase].value]: 1 },
        })
      }
    } else {
      extractedQuestionData.push({
        title,
        input: bitData,
      })
    }
  }

  return extractedQuestionData
}
