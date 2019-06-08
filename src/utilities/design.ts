import * as cheerio from 'cheerio'
import fs from 'fs'
import QuestionOptionsEnum from './@enums/QuestionOptionsEnum'
import StringPatternEnum from './@enums/StringPatternEnum'
import IDesignData from './@interfaces/IDesignData'
import ILocation from './@interfaces/ILocation'
import IQuestionsLocations from './@interfaces/IQuestionsLocations'

type getPatternGroupGETTER = (str: string) => string

const getPatternGroup: getPatternGroupGETTER = str => {
  const QUESTION_PATTERN = new RegExp(/(q[1-9][0-9]?[ad])\b/gi)
  const PATTERN_BARCODE = new RegExp(/barcode/gi)
  const PATTERN_QR = new RegExp(/qrcode/gi)

  if (QUESTION_PATTERN.test(str)) {
    return StringPatternEnum.QUESTION
  }

  if (PATTERN_BARCODE.test(str)) {
    return StringPatternEnum.BARCODE
  }

  if (PATTERN_QR.test(str)) {
    return StringPatternEnum.QRCODE
  }

  return StringPatternEnum.NONE
}

type getDesignDataGetter = (file: string) => IDesignData

const getDesignData: getDesignDataGetter = file => {
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'))
  const svgViewBox = $('svg')[0].attribs.viewBox.split(' ')

  let questions: IQuestionsLocations = {}
  let code: ILocation = { x1: 0, y1: 0, x2: 0, y2: 0 }

  let x
  let y
  let rx
  let ry
  let width
  let height
  let left
  let top
  const groups = $('g')

  // tslint:disable-next-line
  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i]
    const titleCheerio = $(group)

    const title = (
      titleCheerio
        .find('title')
        .first()
        .html() || ''
    )
      .trim()
      .toUpperCase()

    if (!title) {
      continue
    }

    const transform = $(group)
      .attr('transform')
      .replace(/(translate)|\(|\)/gi, '')
      .split(',')
      .map(val => parseInt(val, 10) || 0)

    const rect = $(group)
      .find('rect')
      .first()

    left = parseInt(rect.attr('x'), 10) || 0
    top = parseInt(rect.attr('y'), 10) || 0

    rx = parseInt(rect.attr('rx'), 10) || 0
    ry = parseInt(rect.attr('ry'), 10) || 0

    x = left - rx + transform[0]
    y = top - ry + transform[1]

    width = parseInt(rect.attr('width'), 10) || 0 + rx
    height = parseInt(rect.attr('height'), 10) || 0 + ry

    let questionNumber: string
    let optionTitle: string
    const PATTERN = getPatternGroup(title)

    switch (PATTERN) {
      case StringPatternEnum.QUESTION:
        optionTitle = title.slice(-1)
        questionNumber = title.slice(0, -1)

        if (!questions[questionNumber]) {
          questions[questionNumber] = { x1: 0, y1: 0, x2: 0, y2: 0 }
        }

        if (optionTitle === QuestionOptionsEnum.A) {
          questions[questionNumber].x1 = x - 1
          questions[questionNumber].y1 = y - 1
        } else {
          // donot check last option to suport any number of options
          questions[questionNumber].x2 = x + width + 1
          questions[questionNumber].y2 = y + height + 1
        }
        break
      case StringPatternEnum.BARCODE:
      case StringPatternEnum.QRCODE:
        code = { x1: x, y1: y, x2: x + width, y2: y + height }
        break
      default:
        break
    }
  }

  return {
    code,
    questions,
    width: Math.ceil(parseInt(svgViewBox[2], 10) - parseInt(svgViewBox[0], 10)),
    height: Math.ceil(
      parseInt(svgViewBox[3], 10) - parseInt(svgViewBox[1], 10)
    ),
  }
}

export { getDesignData }
