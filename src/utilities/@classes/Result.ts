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

  public isKey(): boolean {
    return this.rollNo === 'key'
  }

  public hasValidRollNo(): boolean {
    return !this.isKey() && this.rollNo !== ''
  }

  public compile(key: Result) {
    const l = this.list

    Object.keys(l).forEach(k => {
      const userOption = l[k].value
      const keyOption = key.list[k].value

      if (['?', '*', '', ' '].includes(keyOption)) return
      if (userOption === '?') return

      if (userOption === keyOption) {
        // correct answer
      } else {
        // incorrect answer
      }
    })

    throw 'No implemented'
  }
}

export default Result
