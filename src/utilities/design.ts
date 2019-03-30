import * as cheerio from 'cheerio'
import fs from 'fs'

import QuestionOptionsEnum from '../@enums/QuestionOptionsEnum'
import StringPatternEnum from '../@enums/StringPatternEnum'
import IDesignData from '../@interfaces/IDesignData'
import ILocation from '../@interfaces/ILocation'
import IQuestionsLocations from '../@interfaces/IQuestionsLocations'

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

  const questions: IQuestionsLocations = {
    q1: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q2: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q3: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q4: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q5: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q6: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q7: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q8: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q9: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q10: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q11: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q12: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q13: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q14: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q15: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q16: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q17: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q18: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q19: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q20: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q21: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q22: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q23: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q24: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q25: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q26: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q27: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q28: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q29: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q30: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q31: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q32: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q33: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q34: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q35: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q36: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q37: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q38: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q39: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q40: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q41: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q42: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q43: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q44: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q45: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q46: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q47: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q48: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q49: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q50: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q51: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q52: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q53: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q54: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q55: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q56: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q57: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q58: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q59: { x1: 0, y1: 0, x2: 0, y2: 0 },
    q60: { x1: 0, y1: 0, x2: 0, y2: 0 },
  }
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

    let questionNumber
    let optionTitle
    const PATTERN = getPatternGroup(title)

    switch (PATTERN) {
      case StringPatternEnum.QUESTION:
        optionTitle = title.slice(-1)
        questionNumber = title.slice(0, -1)

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

module.exports = {
  getDesignData,
}
