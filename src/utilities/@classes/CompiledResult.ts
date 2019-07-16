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
