import uuid from 'uuid'
import QuestionOptionsEnum from '../@enums/QuestionOptionsEnum'
import RegExpPattern from '../@enums/RegExpPatterns'
import AnswerCollection from '../@interfaces/AnswerCollection'
class Result {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any

  private correctCount: number = 0
  private id: string
  private incorrectCount: number = 0
  private isCompiled: boolean = false
  private marks: number = 0
  private skippedCount: number = 0
  private totalMarks: number = 0
  private unattemptedCount: number = 0

  public answers: AnswerCollection = {}

  public imageFile: string | undefined
  public isRollNoExtracted: boolean
  public post: string = ''
  public questionPaperType: string = ''
  public rollNo: string | undefined
  public testCenter: string = ''
  public testTime: string = ''

  public constructor(rollNo?: string, imageFile?: string) {
    this.id = uuid()
    this.rollNo = rollNo
    this.imageFile = imageFile
    this.isRollNoExtracted = !!rollNo
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromJson(o: Record<string, string>): Result {
    const answerRegExp = new RegExp(RegExpPattern.QUESTION)
    const result =
      typeof o.rollNo === 'string' ? new Result(o.rollNo) : new Result()

    Object.keys(o).forEach(key => {
      const value = o[key]

      if (answerRegExp.test(key)) {
        result.addAnswer(key, value)
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

  public setMarks(marks: number, negativeMarks: number) {
    this.marks = this.correctCount * marks - this.incorrectCount * negativeMarks
    this.totalMarks = (60 - this.skippedCount) * marks
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toJson(): Record<string, any> {
    const o: { [key: string]: string | AnswerCollection } = JSON.parse(
      JSON.stringify(this)
    )

    for (const prop in o) {
      const value = o[prop]

      if (typeof value === 'string') {
        o[prop] = value
      } else {
        for (const subProp in value) {
          o[subProp] = value[subProp].value
        }

        delete o[prop]
      }
    }

    return o
  }
}

export default Result
