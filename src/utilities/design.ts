import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'
import { QuestionOptions } from './QuestionOptions'

export enum RegExpPatterns {
  Barcode = 'barcode$',
  QRCode = 'qrcode$',
  RollNo = 'rollno$',
  Question = 'q[1-9][0-9]?$',
  Option = 'q[1-9][0-9]?[a-e]$',
  ComputerMark = 'mark[0-5]',
}

enum ComputerMarks {
  'mark1' = 'mark1',
  'mark2' = 'mark2',
  'mark3' = 'mark3',
  'mark4' = 'mark4',
  'mark5' = 'mark5',
}

export type ItemInfo = {
  x: number
  y: number
  width: number
  height: number
}

export type QuestionsInfo = {
  [key: string]: {
    [key in QuestionOptions]?: ItemInfo
  }
}

export type ComputerMarksInfo = {
  marks: { [key in ComputerMarks]: ItemInfo }
  leftMargin: number
  rightMargin: number
  topMargin: number
  bottomMargin: number
}

export type DesignData = {
  id?: string
  name?: string
  path?: string
  width: number
  height: number
  isQrCode: boolean
  computerMarksInfo: ComputerMarksInfo
  code: ItemInfo
  rollNo: ItemInfo
  questions: QuestionsInfo
  createAt?: Date
  modifiedAt?: Date
}

// prepare pattern matching reg expressions
const PATTERN_BARCODE = new RegExp(RegExpPatterns.Barcode, 'i')
const PATTERN_QRCODE = new RegExp(RegExpPatterns.QRCode, 'i')
const PATTERN_OPTION = new RegExp(RegExpPatterns.Option, 'i')
const PATTERN_ROLL_NO = new RegExp(RegExpPatterns.RollNo, 'i')
const PATTERN_COMPUTER_MARK = new RegExp(RegExpPatterns.ComputerMark, 'i')

export async function adjustTrimOffsetsForDesign(
  designData: DesignData
): Promise<DesignData> {
  const designDataCopy = JSON.parse(JSON.stringify(designData)) as DesignData
  const { leftMargin, rightMargin, topMargin, bottomMargin } =
    designDataCopy.computerMarksInfo

  designDataCopy.code.x -= leftMargin
  designDataCopy.code.y -= topMargin
  designDataCopy.rollNo.x -= leftMargin
  designDataCopy.rollNo.y -= topMargin
  designDataCopy.width -= leftMargin + rightMargin
  designDataCopy.height -= topMargin + bottomMargin

  Object.values(designDataCopy.questions).forEach((q) => {
    Object.values(q).forEach((v) => {
      if (v) {
        v.x -= leftMargin
        v.y -= topMargin
      }
    })
  })

  return designDataCopy
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
    leftMargin: 0,
    rightMargin: 0,
    topMargin: 0,
    bottomMargin: 0,
    marks: {
      mark1: { x: 0, y: 0, width: 0, height: 0 },
      mark2: { x: 0, y: 0, width: 0, height: 0 },
      mark3: { x: 0, y: 0, width: 0, height: 0 },
      mark4: { x: 0, y: 0, width: 0, height: 0 },
      mark5: { x: 0, y: 0, width: 0, height: 0 },
    },
  }
  const questions: QuestionsInfo = {}
  let isQrCode = false
  let code: ItemInfo = { x: 0, y: 0, width: 0, height: 0 }
  let rollNo: ItemInfo = { x: 0, y: 0, width: 0, height: 0 }

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
        const optionTitle = title.slice(-1) as QuestionOptions

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
        computerMarksInfo.marks[title as ComputerMarks] = ii
      }
    }
  )

  // computer readable marks info
  computerMarksInfo.leftMargin = computerMarksInfo.marks.mark1.x
  computerMarksInfo.topMargin = computerMarksInfo.marks.mark1.y
  computerMarksInfo.rightMargin =
    svgWidth -
    computerMarksInfo.marks.mark2.x -
    computerMarksInfo.marks.mark2.width
  computerMarksInfo.bottomMargin =
    svgHeight -
    computerMarksInfo.marks.mark3.y -
    computerMarksInfo.marks.mark3.height

  // disable offset adjustment until rectagnle detection impemented in image
  return adjustTrimOffsetsForDesign({
    isQrCode,
    computerMarksInfo,
    code,
    rollNo,
    questions,
    width: svgWidth,
    height: svgHeight,
  })
}
