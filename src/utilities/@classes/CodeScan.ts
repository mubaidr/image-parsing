import uuid from 'uuid'

class CodeScan {
  [key: string]: string | number | boolean | null | string[]
  public id: string = uuid()
  public center: string = ''
  public post: string = ''
  public rollNo: string | null = null
  public time: string = ''
  public type: string = ''
  public hasValidRollNo: boolean = false
}

export default CodeScan
