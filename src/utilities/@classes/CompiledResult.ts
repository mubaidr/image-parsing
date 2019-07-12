import uuid from 'uuid'
import Result from './Result'

class CompiledResult {
  private id: string
  private lastSavedTime: Date
  private isCompiled: boolean = false
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

  public addKeyFromJson(obj: object) {
    throw 'Not Implemented'
  }

  public addKey(result: Result) {
    this.key = result
  }

  public addResultFromJson(obj: object) {
    throw 'Not Implemented'
  }

  public addResult(result: Result | Result[]) {
    if (result instanceof Result) {
      this.list.push(result)
    } else {
      this.list.push(...result)
    }

    return this.getCount()
  }

  public toJson(): any[] {
    if (!this.isCompiled) this.compile()

    throw 'Not Implemented'
  }

  public compile() {
    if (!this.key) throw 'Key not loaded'
    if (this.list.length === 0) throw 'Results not loaded'

    this.list.forEach(l => {
      Object.keys(l).forEach(k => {
        const userOption = l.list[k].value
        const keyOption = this.key.list[k].value

        if (['?', '*', '', ' '].includes(keyOption)) return
        if (userOption === '?') return

        if (userOption === keyOption) {
          // correct answer
        } else {
          // incorrect answer
        }

        throw 'Not Implemented'
      })
    })

    this.isCompiled = true
  }

  public save() {
    this.lastSavedTime = new Date()

    // save to local storage
    throw 'Not Implemented'
  }
}

export default CompiledResult
