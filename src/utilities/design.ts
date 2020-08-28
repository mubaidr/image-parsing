import { parse } from 'fast-xml-parser'
import { readFileSync } from 'fs'
import { DesignData, ItemInfo } from './@classes/WorkerManager'
import RegExpPatterns from './@enums/RegExpPatterns'
import { dataPaths } from './dataPaths'

function getDesignPathByID(id: string) {
  //TODO: implement internal store for designs with import/export functionality
  console.log(id)

  return dataPaths.designBarcode
}

export async function getDesignData(id: string): Promise<DesignData> {
  const filePath = getDesignPathByID(id)

  const { svg } = parse(readFileSync(filePath).toString(), {
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
  let code: ItemInfo = { x: 0, y: 0, width: 0, height: 0 }
  const questions: {
    [key: string]: ItemInfo
  } = {}

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

    x = Math.floor(x - rx + xTransform - 3)
    y = Math.floor(y - ry + yTransform - 3)
    width = Math.ceil(width + rx + 6)
    height = Math.ceil(height + ry + 6)

    if (PATTERN_OPTION.test(title)) {
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
