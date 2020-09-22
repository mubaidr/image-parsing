import { v4 as uuid4 } from 'uuid'
import { REG_EXP_PATTERNS } from './design'
import { QUESTION_OPTIONS } from './QUESTION_OPTIONS'

export type AnswerCollection = {
  [key: string]: {
    value: QUESTION_OPTIONS
    unattempted?: boolean
    correct?: boolean
    skipped?: boolean
  }
}

export class Result {
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
  imageFile: string | undefined
  isRollNoExtracted: boolean
  post = ''
  questionPaperType = ''
  rollNo: string | undefined
  testCenter = ''
  testTime = ''

  constructor(rollNo?: string, imageFile?: string) {
    this.id = uuid4()
    this.rollNo = rollNo
    this.imageFile = imageFile
    this.isRollNoExtracted = !!rollNo
  }

  hasImageFile(): boolean {
    return this.imageFile !== undefined
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

  setMarks(marks: number, negativeMarks: number): Result {
    this.marks = this.correctCount * marks - this.incorrectCount * negativeMarks
    this.totalMarks = (60 - this.skippedCount) * marks

    return this
  }

  compile(key: Result, marks?: number, negativeMarks?: number): Result {
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

    if (marks && negativeMarks) {
      this.setMarks(marks, negativeMarks)
    }

    this.isCompiled = true
    return this
  }

  static fromJson(o: any): Result {
    const answerRegExp = new RegExp(REG_EXP_PATTERNS.QUESTION)
    const result = new Result()

    Object.keys(result).forEach((k) => {
      if (k !== 'answers') {
        Object.defineProperty(result, k, value)
      }
    })

    Object.keys(o).forEach((key) => {
      const value = o[key] as QUESTION_OPTIONS

      if (answerRegExp.test(key)) {
        if (typeof value === 'string') {
          result.addAnswer(key, value)
        } else {
          result.addAnswer(key, QUESTION_OPTIONS.NONE)
        }
      } else {
        console.log(result, key, value)

        Object.defineProperty(result, key, value)
      }
    })

    return result
  }
}
