/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid4 } from 'uuid'
import { REG_EXP_PATTERNS } from './design'
import { QUESTION_OPTIONS } from './QUESTION_OPTIONS'

// function instanceOfAnswerCollection(object: any): object is AnswerCollection{
//   return 'member' in object;
// }

export type AnswerCollection = {
  [key: string]: {
    value: QUESTION_OPTIONS
    unattempted?: boolean
    correct?: boolean
    skipped?: boolean
  }
}

export interface ResultJSON {
  [key: string]: unknown

  isCompiled: boolean
  correctCount: number
  incorrectCount: number
  marks: number
  skippedCount: number
  totalMarks: number
  unattemptedCount: number
  post: string
  questionPaperType: string
  testCenter: string
  testTime: string
  id: string
  rollNo?: string
  filePath?: string
  isRollNoExtracted: boolean
}

export class Result {
  [key: string]: unknown

  isCompiled = false
  correctCount = 0
  incorrectCount = 0
  marks = 0
  skippedCount = 0
  totalMarks = 0
  unattemptedCount = 0
  answers: AnswerCollection = {}
  error: string | undefined
  id: string
  filePath: string | undefined
  isRollNoExtracted: boolean
  post = ''
  questionPaperType = ''
  rollNo: string | undefined
  testCenter = ''
  testTime = ''

  constructor(rollNo?: string, filePath?: string) {
    this.id = uuid4()
    this.rollNo = rollNo
    this.filePath = filePath
    this.isRollNoExtracted = !!rollNo
  }

  hasImageFile(): boolean {
    return this.filePath !== undefined
  }

  hasValidRollNo(): boolean {
    return !this.isKey() && this.rollNo !== undefined
  }

  isKey(): boolean {
    return (
      this.rollNo !== undefined && this.rollNo.trim().toLowerCase() === 'key'
    )
  }

  addAnswer(title: string, value: QUESTION_OPTIONS): Result {
    this.answers[title] = { value }

    return this
  }

  setMarks(
    totalQuestions: number,
    correctMarks: number,
    incorrectMarks: number
  ): Result {
    this.marks =
      this.correctCount * correctMarks - this.incorrectCount * incorrectMarks
    this.totalMarks = (totalQuestions - this.skippedCount) * correctMarks

    return this
  }

  compile(key: Result, correctMarks?: number, incorrectMarks?: number): Result {
    if (
      this.isCompiled ||
      this.post !== key.post ||
      this.testTime !== key.testTime ||
      this.testCenter !== key.testCenter ||
      this.questionPaperType !== key.questionPaperType
    ) {
      return this
    }

    const props = Object.keys(key.answers)

    for (let k = 0; k < props.length; k += 1) {
      const prop = props[k]
      const choice = this.answers[prop]
      const keyChoice = key.answers[prop]

      // question not attempted
      if (choice.value === QUESTION_OPTIONS.NONE) {
        choice.unattempted = true
        this.unattemptedCount += 1
      }

      // question skipped
      if (
        keyChoice.value === QUESTION_OPTIONS.NONE ||
        keyChoice.value === QUESTION_OPTIONS.MULTIPLE
      ) {
        choice.skipped = true
        this.skippedCount += 1
        continue
      }

      if (choice.value === keyChoice.value) {
        choice.correct = true
        this.correctCount += 1
      } else {
        choice.correct = false
        this.incorrectCount += 1
      }
    }

    if (correctMarks && incorrectMarks) {
      this.setMarks(
        Object.keys(key.answers).length,
        correctMarks,
        incorrectMarks
      )
    }

    this.isCompiled = true

    return this
  }

  toJson(): ResultJSON {
    const o = JSON.parse(JSON.stringify(this)) as ResultJSON

    // o.answers

    // for (const prop in o) {
    //   const value = o[prop]

    //   if (prop) {
    //     for (const subProp in value) {
    //       o[subProp.toLowerCase()] = value[subProp].value.toLowerCase()
    //     }

    //     delete o[prop]
    //   } else {
    //     o[prop] = value
    //   }
    // }

    return o
  }

  static fromJson(json: ResultJSON): Result {
    const answerRegExp = new RegExp(REG_EXP_PATTERNS.QUESTION)
    const result = new Result()

    Object.keys(json).forEach((key) => {
      const value = json[key] as QUESTION_OPTIONS

      if (answerRegExp.test(key)) {
        result.addAnswer(
          key.toLowerCase(),
          (value.toLowerCase() as QUESTION_OPTIONS) || QUESTION_OPTIONS.NONE
        )
      } else {
        result[key] = value
      }
    })

    if (result.rollNo) result.isRollNoExtracted = true

    return result
  }
}
