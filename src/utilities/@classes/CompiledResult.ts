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

  public getKeyCount(): number {
    return this.keys.length
  }

  public getResultCount(): number {
    return this.results.length
  }

  public addKeys(key: Result | Result[]): CompiledResult {
    if (key instanceof Result) {
      this.keys.push(key)
    } else {
      this.keys.push(...key)
    }

    return this
  }

  public addResults(result: Result | Result[]): CompiledResult {
    if (result instanceof Result) {
      this.results.push(result)
    } else {
      this.results.push(...result)
    }

    return this
  }

  public getKeys(): Result[] {
    return this.keys
  }

  public getResults(): Result[] {
    return this.results
  }

  public compile(marks?: number, negativeMarks?: number): CompiledResult {
    if (this.keys.length === 0) throw 'Keys not loaded'
    if (this.results.length === 0) throw 'Results not loaded'

    for (let i = 0; i < this.keys.length; i += 1) {
      for (let j = 0; j < this.results.length; j += 1) {
        this.results[j].compile(this.keys[i], marks, negativeMarks)
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
          compiledResult.addKeys(result)
        } else {
          compiledResult.addResults(result)
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
          this.addKeys(result)
        } else {
          this.addResults(result)
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
