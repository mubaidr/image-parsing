import uuid from 'uuid'

import QuestionOptionsEnum from '../@enums/QuestionOptionsEnum'
import RegExpPattern from '../@enums/RegExpPatterns'
import AnswerCollection from '../@interfaces/AnswerCollection'
import ResultJson from '../@interfaces/ResultJson'

class Result {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any

  private correctCount = 0
  private id: string
  private incorrectCount = 0
  private isCompiled = false
  private marks = 0
  private skippedCount = 0
  private totalMarks = 0
  private unattemptedCount = 0

  public answers: AnswerCollection = {}

  public imageFile: string | undefined
  public isRollNoExtracted: boolean
  public post = ''
  public questionPaperType = ''
  public rollNo: string | undefined
  public testCenter = ''
  public testTime = ''

  public constructor(rollNo?: string, imageFile?: string) {
    this.id = uuid()
    this.rollNo = rollNo
    this.imageFile = imageFile
    this.isRollNoExtracted = !!rollNo
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromJson(o: ResultJson): Result {
    const answerRegExp = new RegExp(RegExpPattern.QUESTION)
    const result =
      typeof o.rollNo === 'string' ? new Result(o.rollNo) : new Result()

    Object.keys(o).forEach(key => {
      const value = o[key]

      if (answerRegExp.test(key)) {
        if (typeof value === 'string') {
          result.addAnswer(key, value)
        } else {
          result.addAnswer(key, '?')
        }
      } else {
        result[key] = value
      }
    })

    return result
  }

  public addAnswer(title: string, value: string): Result {
    this.answers[title] = {
      value,
      unattempted: false,
      correct: false,
      skipped: false,
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
      if (candidateChoice.value === QuestionOptionsEnum.NONE) {
        candidateChoice.unattempted = true
        this.unattemptedCount += 1
      }

      // question skipped
      if (
        keyChoice.value === QuestionOptionsEnum.NONE ||
        keyChoice.value === QuestionOptionsEnum.MULTIPLE
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
    return this.rollNo === 'key'
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toJson(): Record<string, any> {
    const o: { [key: string]: string | AnswerCollection } = JSON.parse(
      JSON.stringify(this),
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
