import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'

// import QuestionOptionsEnum from './@enums/QuestionOptionsEnum'
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
  const svgWidth = x2 - x1
  const svgHeight = y2 - y1

  // prepare pattern matching reg expressions
  const PATTERN_OPTION = new RegExp(RegExpPatterns.OPTION, 'i')
  const PATTERN_BARCODE = new RegExp(RegExpPatterns.BARCODE, 'i')
  const PATTERN_QRCODE = new RegExp(RegExpPatterns.QRCODE, 'i')

  // for export
  const questions: QuestionsLocations = {}
  let code: Location = { x: 0, y: 0, width: 0, height: 0 }

  svg.g.forEach((group: any) => {
    const { title, transform, rect } = group

    if (!rect) return

    const { rx, ry } = rect
    let { x, y, width, height } = rect
    let xTransform = 0
    let yTransform = 0

    if (transform) {
      ;[xTransform, yTransform] = transform
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')
        .map((val: string) => parseInt(val, 10) || 0)
    }

    x = x - rx + xTransform - 3
    y = y - ry + yTransform - 6
    width = width + rx + 6
    height = height + ry + 6

    if (PATTERN_OPTION.test(title)) {
      // const option: string = title.slice(-1)
      const questionNumber: string = title.slice(0, -1)

      if (!questions[questionNumber]) {
        questions[questionNumber] = {
          x: svgWidth,
          y: svgHeight,
          width: 0,
          height: 0,
        }
      }

      questions[questionNumber].width += width

      if (questions[questionNumber].x > x) {
        questions[questionNumber].x = x
      }

      if (questions[questionNumber].y > y) {
        questions[questionNumber].y = y
      }

      if (questions[questionNumber].width < width) {
        questions[questionNumber].width = width
      }

      if (questions[questionNumber].height < height) {
        questions[questionNumber].height = height
      }
    } else if (PATTERN_BARCODE.test(title) || PATTERN_QRCODE.test(title)) {
      code = { x, y, width, height }
    }
  })

  return {
    code,
    questions,
    width: svgWidth,
    height: svgHeight,
  }
}

export { getDesignData }
