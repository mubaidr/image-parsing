import uuid from 'uuid'
import Option from './Option'

class Result {
  private id: string = uuid()

  public rollNo: string = ''
  public imageFile: string = ''

  public correct: Option[] = []
  public incorrect: Option[] = []
  public unattempted: Option[] = []

  public constructor() {}

  public hasValidRollNo(): boolean {
    return this.rollNo !== ''
  }
}

export default Result
