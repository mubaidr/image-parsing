import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'

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

  // TODO: fix the box siz calculations obtained from svg
  console.log(svg)

  // get width, height from viewbox
  const [x1, y1, x2, y2] = svg.viewBox
    .split(' ')
    .map((i: string) => parseInt(i, 10))
  const width = x2 - x1
  const height = y2 - y1

  // prepare pattern matching reg expressions
  const PATTERN_QUESTION = new RegExp(RegExpPatterns.QUESTION, 'i')
  const PATTERN_BARCODE = new RegExp(RegExpPatterns.BARCODE, 'i')
  const PATTERN_QRCODE = new RegExp(RegExpPatterns.QRCODE, 'i')

  // for export
  const questions: QuestionsLocations = {}
  let code: Location = { x1: 0, y1: 0, x2: 0, y2: 0 }

  // local vars
  let x = 0
  let y = 0
  let rx = 0
  let ry = 0
  let w = 0
  let h = 0
  let xTransform = 0
  let yTransform = 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  svg.g.forEach((group: any) => {
    const { title, transform, rect } = group

    if (rect) {
      ;({ x, y, width: w, height: h, rx, ry } = rect)
    }

    if (transform) {
      ;[xTransform, yTransform] = transform
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')
        .map((val: string) => parseInt(val, 10) || 0)
    }

    const x1 = x + rx + xTransform
    const y1 = y + ry + yTransform

    const location = { x1: x1, y1: y1, x2: x1 + w, y2: y1 + h }

    if (PATTERN_QUESTION.test(title)) {
      questions[title] = location
    }

    if (PATTERN_BARCODE.test(title) || PATTERN_QRCODE.test(title)) {
      code = location
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
