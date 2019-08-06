import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'

import QuestionOptionsEnum from './@enums/QuestionOptionsEnum'
import RegExpPatterns from './@enums/RegExpPatterns'
import DesignData from './@interfaces/DesignData'
import Location from './@interfaces/Location'
import QuestionsLocations from './@interfaces/QuestionsLocations'

const getDesignData = (file: string): DesignData => {
  const { svg } = parse(readFileSync(file).toString(), {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: true,
    allowBooleanAttributes: true,
  })

  // get width, height from viewbox
  const [x1, y1, x2, y2] = svg.viewBox
    .split(' ')
    .map((i: string) => parseInt(i, 10))
  const width = x2 - x1
  const height = y2 - y1

  // prepare pattern matching reg expressions
  const PATTERN_OPTION = new RegExp(RegExpPatterns.OPTION, 'i')
  const PATTERN_BARCODE = new RegExp(RegExpPatterns.BARCODE, 'i')
  const PATTERN_QRCODE = new RegExp(RegExpPatterns.QRCODE, 'i')

  // for export
  const questions: QuestionsLocations = {}
  let code: Location = { x1: 0, y1: 0, x2: 0, y2: 0 }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  svg.g.forEach((group: any) => {
    const { title, transform, rect } = group

    if (!rect) return

    let { x, y, rx, ry, width: itemWidth, height: itemHeight } = rect
    let xTransform = 0
    let yTransform = 0

    if (transform) {
      ;[xTransform, yTransform] = transform
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')
        .map((val: string) => parseInt(val, 10) || 0)
    }

    const x1 = x - rx + xTransform - 1
    const y1 = y - ry + yTransform - 1
    const x2 = x1 + itemWidth + rx + 1
    const y2 = y1 + itemHeight + ry + 1

    if (PATTERN_OPTION.test(title)) {
      const option: string = title.slice(-1)
      const questionNumber: string = title.slice(0, -1)

      if (!questions[questionNumber]) {
        questions[questionNumber] = { x1, y1, x2, y2 }
      }

      if (option === QuestionOptionsEnum.A) {
        questions[questionNumber].x1 = x1
        questions[questionNumber].y1 = y1
      } else if (option === QuestionOptionsEnum.D || QuestionOptionsEnum.E) {
        // donot check last option to suport any number of options
        questions[questionNumber].x2 = x2
        questions[questionNumber].y2 = y2
      }
    } else if (PATTERN_BARCODE.test(title) || PATTERN_QRCODE.test(title)) {
      code = { x1, y1, x2, y2 }
    }
  })

  return {
    code,
    questions,
    width,
    height,
  }
}

export { getDesignData }
