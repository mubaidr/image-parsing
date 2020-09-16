import { v4 as uuid4 } from 'uuid'
import { QUESTION_OPTIONS_ENUM, REG_EXP_PATTERNS } from './design'

interface AnswerCollection {
  [key: string]: {
    value: QUESTION_OPTIONS_ENUM
    unattempted?: boolean
    correct?: boolean
    skipped?: boolean
  }
}

export interface ResultJson {
  [key: string]: string | Record<string, unknown> | undefined
  answers: AnswerCollection
}

class Result implements ResultJson {
  [key: string]: any

  private correctCount = 0
  private incorrectCount = 0
  private isCompiled = false
  private marks = 0
  private skippedCount = 0
  private totalMarks = 0
  private unattemptedCount = 0

  public answers: AnswerCollection = {}

  public error: string | undefined
  public id: string
  public imageFile: string | undefined
  public isRollNoExtracted: boolean
  public post = ''
  public questionPaperType = ''
  public rollNo: string | undefined
  public testCenter = ''
  public testTime = ''

  public constructor(rollNo?: string, imageFile?: string) {
    this.id = uuid4()
    this.rollNo = rollNo
    this.imageFile = imageFile
    this.isRollNoExtracted = !!rollNo
  }

  public static fromJson(o: any): Result {
    const answerRegExp = new RegExp(REG_EXP_PATTERNS.QUESTION)
    const result =
      typeof o.rollNo === 'string' ? new Result(o.rollNo) : new Result()

    Object.keys(o).forEach((key) => {
      const value = o[key] as QUESTION_OPTIONS_ENUM

      if (answerRegExp.test(key)) {
        if (typeof value === 'string') {
          result.addAnswer(key, value)
        } else {
          result.addAnswer(key, QUESTION_OPTIONS_ENUM.NONE)
        }
      } else {
        result[key] = value
      }
    })

    return result
  }

  public addAnswer(title: string, value: QUESTION_OPTIONS_ENUM): Result {
    this.answers[title] = {
      value,
    }

    return this
  }

  public compile(key: Result, marks?: number, negativeMarks?: number): Result {
    if (this.isCompiled) return this
    if (!this.matchWithKey(key)) return this

    const props = Object.keys(key.answers)

    for (let k = 0; k < props.length; k += 1) {
      const prop = props[k]
      const keyChoice = key.answers[prop]
      const candidateChoice = this.answers[prop]

      // question not attempted
      if (candidateChoice.value === QUESTION_OPTIONS_ENUM.NONE) {
        candidateChoice.unattempted = true
        this.unattemptedCount += 1
      }

      // question skipped
      if (
        keyChoice.value === QUESTION_OPTIONS_ENUM.NONE ||
        keyChoice.value === QUESTION_OPTIONS_ENUM.MULTIPLE
      ) {
        candidateChoice.skipped = true
        this.skippedCount += 1
        continue
      }

      if (candidateChoice.value === keyChoice.value) {
        candidateChoice.correct = true
        this.correctCount += 1
      } else {
        candidateChoice.correct = false
        this.incorrectCount += 1
      }
    }

    this.isCompiled = true

    if (marks && negativeMarks) {
      this.setMarks(marks, negativeMarks)
    }

    return this
  }

  public getCorrectCount(): number {
    return this.correctCount
  }

  public getInCorrectCount(): number {
    return this.incorrectCount
  }

  public getMarks(): number {
    return this.marks
  }

  public getSkippedCount(): number {
    return this.skippedCount
  }

  public getTotalMarks(): number {
    return this.totalMarks
  }

  public getUnattemptedCount(): number {
    return this.unattemptedCount
  }

  public hasImageFile(): boolean {
    return this.imageFile !== undefined
  }

  public hasValidRollNo(): boolean {
    return !this.isKey() && this.rollNo !== undefined
  }

  public isKey(): boolean {
    return (
      this.rollNo !== undefined && this.rollNo.trim().toLowerCase() === 'key'
    )
  }

  public isResult(): boolean {
    return !this.isKey()
  }

  public matchWithKey(key: Result): boolean {
    return (
      this.post === key.post &&
      this.testCenter === key.testCenter &&
      this.testTime === key.testTime &&
      this.questionPaperType === key.questionPaperType
    )
  }

  public setMarks(marks: number, negativeMarks: number): Result {
    this.marks = this.correctCount * marks - this.incorrectCount * negativeMarks
    this.totalMarks = (60 - this.skippedCount) * marks

    return this
  }

  public toJson(): Record<string, any> {
    const o: { [key: string]: string | AnswerCollection } = JSON.parse(
      JSON.stringify(this)
    )

    for (const prop in o) {
      const value = o[prop]

      if (typeof value === 'object') {
        for (const subProp in value) {
          o[subProp] = value[subProp].value
        }

        delete o[prop]
      } else {
        o[prop] = value
      }
    }

    return o
  }
}

export default Result
