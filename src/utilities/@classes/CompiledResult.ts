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

  public compilationRequired(): boolean {
    return !this.results.every(result => result.isCompiled)
  }

  public getKeyCount(): number {
    return this.keys.length
  }

  public getResultCount(): number {
    return this.results.length
  }

  public addKey(result: Result): CompiledResult {
    this.keys.push(result)

    return this
  }

  public addResult(result: Result): CompiledResult {
    this.results.push(result)

    return this
  }

  public getKeys(): Result[] {
    return this.keys
  }

  public getResults(): Result[] {
    return this.results
  }

  public compile(): CompiledResult {
    if (this.keys.length === 0) throw 'Keys not loaded'
    if (this.results.length === 0) throw 'Results not loaded'

    if (!this.compilationRequired()) return this

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

    return this
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

  public fromExcel(src: string): CompiledResult {
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

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public export(): any[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any[] = []

    this.results.forEach(result => {
      obj.push(result.toJson())
    })

    return obj
  }

  public save(): CompiledResult {
    //TODO: use electron settings
    throw 'Not Implemented'
  }

  public static load(): CompiledResult[] {
    //TODO: use electron settings
    throw 'Not Implemented'
  }
}

export default CompiledResult
