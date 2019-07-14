import uuid from 'uuid'
import IAnswer from '../@interfaces/IAnswer'

class Result {
  private id: string
  public list: IAnswer = {}
  public rollNo: string = ''
  public imageFile: string = ''

  public constructor(rollNo: string, imageFile: string) {
    this.id = uuid()
    this.rollNo = rollNo
    this.imageFile = imageFile
  }

  public addAnswer(title: string, value: string) {
    this.list[title] = { value }
  }

  public isKey(): boolean {
    return this.rollNo === 'key'
  }

  public hasValidRollNo(): boolean {
    return !this.isKey() && this.rollNo !== ''
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromJson(obj: any): Result {
    throw 'Not Implemented'
  }
}

export default Result
