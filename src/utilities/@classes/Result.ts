import uuid from 'uuid'
import IAnswer from '../@interfaces/IAnswer'
import IResult from '../@interfaces/IResult'

class Result implements IResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  private id: string
  private isCompiled: boolean = false

  public answers: IAnswer = {}
  public rollNo: string | undefined
  public imageFile: string | undefined
  public post: string = ''
  public testCenter: string = ''
  public testTime: string = ''
  public questionPaperType: string = ''

  private marks: number = 0
  private totalMarks: number = 0
  private correctCount: number = 0
  private incorrectCount: number = 0
  private unattemptedCount: number = 0
  private skippedCount: number = 0

  public constructor(rollNo?: string, imageFile?: string) {
    this.id = uuid()
    this.rollNo = rollNo
    this.imageFile = imageFile
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

  public getMarks(): number {
    return this.marks
  }

  public getTotalMarks(): number {
    return this.totalMarks
  }

  public getCorrectCount(): number {
    return this.correctCount
  }

  public getInCorrectCount(): number {
    return this.incorrectCount
  }

  public getUnattemptedCount(): number {
    return this.unattemptedCount
  }

  public getSkippedCount(): number {
    return this.skippedCount
  }

  public isKey(): boolean {
    return this.rollNo === 'key'
  }

  public isResult(): boolean {
    return !this.isKey()
  }

  public hasValidRollNo(): boolean {
    return !this.isKey() && this.rollNo !== undefined
  }

  public hasImageFile(): boolean {
    return this.imageFile !== undefined
  }

  public matchWithKey(key: Result): boolean {
    return (
      this.post === key.post &&
      this.testCenter === key.testCenter &&
      this.testTime === key.testTime &&
      this.questionPaperType === key.questionPaperType
    )
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
      if ([' ', '?'].includes(candidateChoice.value)) {
        candidateChoice.unattempted = true
        this.unattemptedCount += 1
        continue
      }

      // question skipped
      if ([' ', '?', '*'].includes(keyChoice.value)) {
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

  public setMarks(marks: number, negativeMarks: number) {
    if (!this.isCompiled) return

    this.marks = this.correctCount * marks - this.incorrectCount * negativeMarks
    this.totalMarks =
      (this.correctCount +
        this.incorrectCount +
        this.unattemptedCount -
        this.skippedCount) *
      marks
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromJson(o: { [key: string]: string }): Result {
    const result = new Result()
    const answerRegExp = /q[0-9]{1,2}$$/im

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

  public toJson(): { [key: string]: string } {
    const o: { [key: string]: string } = this

    for (const prop in this) {
      const value = this[prop]

      if (typeof value === 'object') {
        for (const subProp in value) {
          o[subProp] = value[subProp].value
        }

        delete o[prop]
      } else {
        o[prop] = value
      }
    }

    // delete o.isCompiled
    return o
  }
}

export default Result
