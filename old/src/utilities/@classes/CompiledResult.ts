import uuid from 'uuid'

import { importExcelToJson } from '../excel'
import Result from './Result'

class CompiledResult {
  private id: string
  private keys: Result[] = []
  private lastSavedTime: Date | undefined
  private results: Result[] = []

  public constructor() {
    this.id = uuid()
  }

  public static export(compiledResult: CompiledResult): any[] {
    const obj: any[] = []

    compiledResult
      .sortResults()
      .getResults()
      .forEach(result => {
        obj.push(result.toJson())
      })

    return obj
  }

  public static loadFromExcel(src: string): CompiledResult {
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

    compiledResult.sortResults()

    return compiledResult
  }

  public static merge(compiledResults: CompiledResult[]): CompiledResult {
    const compiledResult = new CompiledResult()

    compiledResults.forEach(cr => {
      compiledResult
        .addKeys(cr.getKeys())
        .addResults(cr.getResults())
        .sortResults()
    })

    return compiledResult
  }

  public addFromExcel(src: string): CompiledResult {
    const rows: any[] = importExcelToJson(src)

    rows.forEach(row => {
      const result = Result.fromJson(row)

      if (result.isKey()) {
        this.addKeys(result)
      } else {
        this.addResults(result)
      }
    })

    this.sortResults()

    return this
  }

  public add(obj: Result): CompiledResult {
    if (obj.isKey()) {
      const notAdded =
        this.keys.findIndex(key => {
          return key.id === obj.id
        }) === -1

      if (notAdded) this.keys.push(obj)
    } else {
      this.results.push(obj)
    }

    return this
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
    if (this.keys.length === 0) throw new Error('Keys not loaded')
    if (this.results.length === 0) throw new Error('Results not loaded')

    for (let i = 0; i < this.keys.length; i += 1) {
      for (let j = 0; j < this.results.length; j += 1) {
        this.results[j].compile(this.keys[i], marks, negativeMarks)
      }
    }

    return this
  }

  public export(): any[] {
    const obj: any[] = []

    this.sortResults()
      .getResults()
      .forEach(result => {
        obj.push(result.toJson())
      })

    return obj
  }

  public getKeyCount(): number {
    return this.keys.length
  }

  public getKeys(): Result[] {
    return this.keys
  }

  public getResultCount(): number {
    return this.results.length
  }

  public getResults(): Result[] {
    return this.results
  }

  public getKeysAndResults(): Result[] {
    return [...this.results, ...this.keys]
  }

  public reverseResults(): CompiledResult {
    this.results.reverse()

    return this
  }

  public sortResults(): CompiledResult {
    this.results.sort((a, b) => {
      return parseInt(a.rollNo || '0', 10) - parseInt(b.rollNo || '0', 10)
    })

    return this
  }

  public getRandomResults(percent: number | undefined): Result[] {
    const resultCount = this.getResultCount()
    const count = Math.max(Math.floor(((percent || 5) * resultCount) / 100), 1)
    const ids: string[] = []
    const results: Result[] = []

    for (let i = 0; i < count; ) {
      const index = Math.floor(Math.random() * resultCount)
      const result = this.results[index]

      if (ids.includes(result.id)) continue

      results.push(this.results[index])
      ids.push(result.id)
      i += 1
    }

    return results
  }
}

export default CompiledResult
