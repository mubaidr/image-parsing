import uuid from 'uuid'
import Result from './Result'

class CompiledResult {
  private id: string
  private lastSavedTime: Date
  public post: string = ''
  public testCenter: string = ''
  public testTime: string = ''
  public type: string = ''

  private key!: Result
  public list: Result[] = []

  public constructor() {
    this.id = uuid()
    this.lastSavedTime = new Date()
  }

  public getCount(): number {
    return this.list.length
  }

  public empty() {
    this.list.length = 0
  }

  public addKey(result: Result) {
    this.key = result
  }

  public addResult(result: Result) {
    this.list.push(result)

    return this.getCount()
  }

  public compileAll() {
    if (!this.key) throw 'Key not loaded'

    this.list.forEach(r => r.compile(this.key))
  }

  public save() {
    this.lastSavedTime = new Date()

    // save to local storage
    throw 'Not Implemented'
  }
}

export default CompiledResult
