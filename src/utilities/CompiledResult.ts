import { v4 as uuidv4 } from 'uuid'
import { importExcelToJson } from './excel'
import { Result } from './Result'

export class CompiledResult {
  id: string
  lastSavedTime: Date | undefined
  keys: Result[] = []
  results: Result[] = []

  constructor() {
    this.id = uuidv4()
  }

  static loadFromExcel(src: string): CompiledResult {
    const rows: unknown[] = importExcelToJson(src)
    const compiledResult = new CompiledResult()

    rows.forEach((row) => {
      const result = Result.fromJson(row)

      if (result.isKey()) {
        compiledResult.addKeys([result])
      } else {
        compiledResult.addResults([result])
      }
    })

    return compiledResult
  }

  addKeys(keys: Result[]): CompiledResult {
    this.keys.push(...keys)
    return this
  }

  addResults(results: Result[]): CompiledResult {
    this.results.push(...results)
    return this
  }

  getKeysAndResults(): Result[] {
    return [...this.keys, ...this.results]
  }

  compile(marks?: number, negativeMarks?: number): CompiledResult {
    if (this.keys.length === 0) throw new Error('Keys not loaded')
    if (this.results.length === 0) throw new Error('Results not loaded')

    for (let i = 0; i < this.keys.length; i += 1) {
      for (let j = 0; j < this.results.length; j += 1) {
        this.results[j].compile(this.keys[i], marks, negativeMarks)
      }
    }

    return this
  }

  sortResults(): CompiledResult {
    this.results.sort((a, b) => {
      return parseInt(a.rollNo || '0', 10) - parseInt(b.rollNo || '0', 10)
    })

    return this
  }

  static merge(compiledResults: CompiledResult[]): CompiledResult {
    const compiledResult = new CompiledResult()

    compiledResults.forEach((cr) => {
      compiledResult.addKeys(cr.keys).addResults(cr.results)
    })

    return compiledResult
  }
}
