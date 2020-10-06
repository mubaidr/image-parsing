import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'
import { QUESTION_OPTIONS } from './QUESTION_OPTIONS'

export enum REG_EXP_PATTERNS {
  BARCODE = 'barcode$',
  QRCODE = 'qrcode$',
  ROLL_NO = 'rollno$',
  QUESTION = 'q[1-9][0-9]?$',
  OPTION = 'q[1-9][0-9]?[a-e]$',
  COMPUTER_MARK = 'mark[0-5]',
}

export type ItemInfo = {
  x: number
  y: number
  width: number
  height: number
}

export type QuestionsInfo = {
  [key: string]: {
    [key in QUESTION_OPTIONS]?: ItemInfo
  }
}

enum ComputerMarks {
  'mark1' = 'mark1',
  'mark2' = 'mark2',
  'mark3' = 'mark3',
  'mark4' = 'mark4',
  'mark5' = 'mark5',
}

export type ComputerMarksInfo = {
  [key in ComputerMarks]: ItemInfo
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
  const computerMarksInfo: ComputerMarksInfo = {
    mark1: { x: 0, y: 0, width: 0, height: 0 },
    mark2: { x: 0, y: 0, width: 0, height: 0 },
    mark3: { x: 0, y: 0, width: 0, height: 0 },
    mark4: { x: 0, y: 0, width: 0, height: 0 },
    mark5: { x: 0, y: 0, width: 0, height: 0 },
  }
  const questions: QuestionsInfo = {}
  let isQrCode = false
  let code: ItemInfo = { x: 0, y: 0, width: 0, height: 0 }
  let rollNo: ItemInfo = { x: 0, y: 0, width: 0, height: 0 }

  // prepare pattern matching reg expressions
  const PATTERN_BARCODE = new RegExp(REG_EXP_PATTERNS.BARCODE, 'i')
  const PATTERN_QRCODE = new RegExp(REG_EXP_PATTERNS.QRCODE, 'i')
  const PATTERN_OPTION = new RegExp(REG_EXP_PATTERNS.OPTION, 'i')
  const PATTERN_ROLL_NO = new RegExp(REG_EXP_PATTERNS.ROLL_NO, 'i')
  const PATTERN_COMPUTER_MARK = new RegExp(REG_EXP_PATTERNS.COMPUTER_MARK, 'i')

  // TODO: find margins then iterate over groups for easier update of x,y

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

      x = Math.floor(x + xTransform)
      y = Math.floor(y + yTransform)
      width = Math.ceil(width)
      height = Math.ceil(height)

      const ii = { x, y, width, height }

      if (PATTERN_OPTION.test(title)) {
        const questionTitle = title.slice(0, -1)
        const optionTitle = title.slice(-1) as QUESTION_OPTIONS

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
      } else if (PATTERN_COMPUTER_MARK.test(title)) {
        computerMarksInfo[title as ComputerMarks] = ii
      }
    }
  )

  const leftMargin = computerMarksInfo.mark1.x
  const topMargin = computerMarksInfo.mark1.y
  const rightMargin =
    svgWidth - computerMarksInfo.mark2.x - computerMarksInfo.mark2.width
  const bottomMargin =
    svgHeight - computerMarksInfo.mark3.y - computerMarksInfo.mark3.height

  code.x -= leftMargin
  code.y -= topMargin

  rollNo.x -= leftMargin
  rollNo.y -= topMargin

  return {
    isQrCode,
    code,
    rollNo,
    questions,
    width: svgWidth - leftMargin - rightMargin,
    height: svgHeight - topMargin - bottomMargin,
  }
}
