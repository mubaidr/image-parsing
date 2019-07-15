import uuid from 'uuid'
import { importExcelToJson } from '../excel'
import Result from './Result'

class CompiledResult {
  private id: string
  private lastSavedTime: Date | undefined

  private keys: Result[] = []
  private results: Result[] = []

  public constructor() {
    this.id = uuid()
  }

  public clear() {
    this.keys.length = 0
    this.results.length = 0
  }

  public compilationRequired(): boolean {
    return !this.results.every(result => result.isCompiled)
  }

  public getKeyCount(): number {
    return this.keys.length
  }

  public getResultCount(): number {
    return this.results.length
  }

  public addKey(result: Result) {
    this.keys.push(result)

    return this.keys.length
  }

  public addResult(result: Result) {
    this.results.push(result)

    return this.results.length
  }

  public compile() {
    if (this.keys.length === 0) throw 'Keys not loaded'
    if (this.results.length === 0) throw 'Results not loaded'

    if (!this.compilationRequired()) return

    for (let i = 0; i < this.keys.length; i += 1) {
      const key = this.keys[i]
      const props = Object.keys(key.answers)

      for (let j = 0; j < this.results.length; j += 1) {
        const result = this.results[j]

        if (result.isCompiled) continue
        if (!result.matchWithKey(key)) continue

        result.isCompiled = true

        for (let k = 0; k < props.length; k += 1) {
          const prop = props[k]

          const keyChoice = key.answers[prop]
          const candidateChoice = result.answers[prop]

          // question not attempted
          if ([' ', '?'].includes(candidateChoice.value)) {
            candidateChoice.unattempted = true
            continue
          }

          // question skipped
          if ([' ', '?', '*'].includes(keyChoice.value)) {
            candidateChoice.skipped = true
          }

          candidateChoice.correct = candidateChoice.value === keyChoice.value
        }
      }
    }
  }

  public static fromExcel(src: string): CompiledResult[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sheets: any[][] = importExcelToJson(src)
    const compiledResults: CompiledResult[] = []

    sheets.forEach(sheet => {
      const compiledResult = new CompiledResult()

      sheet.forEach(row => {
        const result = Result.fromJson(row)

        if (result.isKey()) {
          compiledResult.addKey(result)
        } else {
          compiledResult.addResult(result)
        }
      })

      compiledResults.push(compiledResult)
    })

    return compiledResults
  }

  public fromExcel(src: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sheets: any[][] = importExcelToJson(src)

    sheets.forEach(sheet => {
      sheet.forEach(row => {
        const result = Result.fromJson(row)

        if (result.isKey()) {
          this.addKey(result)
        } else {
          this.addResult(result)
        }
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toJson(): any[] {
    this.compile()

    throw 'Not Implemented'
  }

  public save() {
    this.lastSavedTime = new Date()

    // save to local storage
    throw 'Not Implemented'
  }
}

export default CompiledResult
