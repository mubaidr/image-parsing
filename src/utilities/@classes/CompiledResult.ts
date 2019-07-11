import Result from './Result'

class CompiledResult {
  public center: string = ''
  public post: string = ''
  public time: string = ''
  public type: string = ''
  public keyPath: string = ''

  public skippedQuestions: string[] = []
  public list: Result[] = []

  public constructor() {}

  public getCount(): number {
    return this.list.length
  }

  public empty() {
    this.list.length = 0
  }

  public add(result: Result) {
    this.list.push(result)

    return this.getCount()
  }
}

export default CompiledResult
