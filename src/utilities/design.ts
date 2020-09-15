import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'

export enum REG_EXP_PATTERNS {
  BARCODE = 'barcode$',
  QRCODE = 'qrcode$',
  ROLL_NO = 'rollno$',
  QUESTION = 'q[1-9][0-9]?$',
  OPTION = 'q[1-9][0-9]?[a-e]$',
  NONE = '',
}

// enum QuestionPaperTypeEnum {
//   A = 'a',
//   B = 'c',
//   C = 'c',
//   D = 'd',
//   E = 'e',
//   F = 'f',
//   G = 'g',
//   H = 'h',
//   I = 'i',
//   J = 'j',
//   K = 'k',
// }

export enum QUESTION_OPTIONS_ENUM {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  MULTIPLE = '*',
  NONE = '?',
}

export type ItemInfo = {
  x: number
  y: number
  width: number
  height: number
}

export type QuestionsInfo = {
  [key: string]: {
    [key in QUESTION_OPTIONS_ENUM]?: ItemInfo
  }
}

export type DesignData = {
  id?: string
  name?: string
  path?: string
  width: number
  height: number
  isQrCode: boolean
  code: ItemInfo
  rollNo: ItemInfo
  questions: QuestionsInfo
  createAt?: Date
  modifiedAt?: Date
}

export async function getDesignData(designPath: string): Promise<DesignData> {
  const { svg } = parse(readFileSync(designPath).toString().toLowerCase(), {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: true,
    allowBooleanAttributes: true,
  })

  // get width, height from viewbox
  const [x1, y1, x2, y2] = svg.viewbox
    .split(' ')
    .map((i: string) => parseInt(i, 10))
  const svgWidth = x2 - x1
  const svgHeight = y2 - y1

  // for export
  const questions: QuestionsInfo = {}
  let code: ItemInfo = { x: 0, y: 0, width: 0, height: 0 }
  let rollNo: ItemInfo = { x: 0, y: 0, width: 0, height: 0 }
  let isQrCode = false

  svg.g.forEach(
    (group: {
      title: string
      transform: string
      rect: {
        x: number
        y: number
        width: number
        height: number
      }
    }) => {
      const { title, transform, rect } = group

      if (!title || !rect) return

      let { x, y, width, height } = rect
      let xTransform = 0
      let yTransform = 0

      if (transform) {
        ;[xTransform, yTransform] = transform
          .replace(/(translate)|\(|\)/gi, '')
          .split(',')
          .map((val: string) => parseInt(val, 10) || 0)
      }

      x = Math.floor(x + xTransform - 3)
      y = Math.floor(y + yTransform - 3)
      width = Math.ceil(width + 6)
      height = Math.ceil(height + 6)

      const ii = { x, y, width, height }
      // prepare pattern matching reg expressions
      const PATTERN_OPTION = new RegExp(REG_EXP_PATTERNS.OPTION, 'i')
      const PATTERN_BARCODE = new RegExp(REG_EXP_PATTERNS.BARCODE, 'i')
      const PATTERN_QRCODE = new RegExp(REG_EXP_PATTERNS.QRCODE, 'i')
      const PATTERN_ROLL_NO = new RegExp(REG_EXP_PATTERNS.ROLL_NO, 'i')

      if (PATTERN_OPTION.test(title)) {
        const questionTitle = title.slice(0, -1)
        const optionTitle = title.slice(-1) as QUESTION_OPTIONS_ENUM

        if (questions[questionTitle] === undefined) {
          questions[questionTitle] = {}
        }
        questions[questionTitle][optionTitle] = ii
      } else if (PATTERN_ROLL_NO.test(title)) {
        rollNo = ii
      } else if (PATTERN_BARCODE.test(title)) {
        code = ii
      } else if (PATTERN_QRCODE.test(title)) {
        code = ii
        isQrCode = true
      }
    }
  )

  return {
    isQrCode,
    code,
    rollNo,
    questions,
    width: svgWidth,
    height: svgHeight,
  }
}
