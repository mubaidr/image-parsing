import uuid from 'uuid'
import IAnswer from '../@interfaces/IAnswer'
import IResult from '../@interfaces/IResult'

class Result implements IResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  private id: string
  public isCompiled: boolean = false
  public answers: IAnswer = {}
  public rollNo: string | undefined
  public imageFile: string | undefined
  public post: string = ''
  public testCenter: string = ''
  public testTime: string = ''
  public questionPaperType: string = ''

  public constructor(rollNo?: string, imageFile?: string) {
    this.id = uuid()
    this.rollNo = rollNo
    this.imageFile = imageFile
  }

  public getMarks() {}
  public getTotalMarks() {}
  public getCorrectAnswers() {}
  public getInCorrectAnswers() {}
  public getUnattemptedAnswers() {}
  public getSkippedAnswers() {}

  public addAnswer(title: string, value: string): Result {
    this.answers[title] = {
      value,
      unattempted: false,
      correct: false,
      skipped: false,
    }

    return this
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
    const o: { [key: string]: string } = Object.create(this)

    for (const prop in this) {
      const value = this[prop]

      if (typeof value === 'object') {
        for (const subProp in value) {
          o[subProp] = value[subProp].value
        }
      } else {
        o[prop] = value
      }
    }

    delete o.isCompiled
    return o
  }
}

export default Result
