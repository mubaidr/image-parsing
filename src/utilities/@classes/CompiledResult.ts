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

  public getKeys(): Result[] {
    return this.keys
  }

  public getResults(): Result[] {
    return this.results
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

  public static loadFromExcel(src: string): CompiledResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = importExcelToJson(src)
    const compiledResult = new CompiledResult()

    rows.forEach(row => {
      const result = Result.fromJson(row)

      if (result.isKey()) {
        compiledResult.addKeys(result)
      } else {
        compiledResult.addResults(result)
      }
    })

    return compiledResult
  }

  public addFromExcel(src: string): CompiledResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = importExcelToJson(src)

    rows.forEach(row => {
      const result = Result.fromJson(row)

      if (result.isKey()) {
        this.addKeys(result)
      } else {
        this.addResults(result)
      }
    })

    return this
  }

  public static merge(compiledResults: CompiledResult[]): CompiledResult {
    const compiledResult = new CompiledResult()

    compiledResults.forEach(cr => {
      compiledResult.addKeys(cr.getKeys()).addResults(cr.getResults())
    })

    return compiledResult
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static export(compiledResult: CompiledResult): any[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any[] = []

    compiledResult.results.forEach(result => {
      obj.push(result.toJson())
    })

    return obj
  }
}

export default CompiledResult
