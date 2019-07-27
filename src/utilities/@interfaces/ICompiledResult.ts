import CompiledResult from '../@classes/CompiledResult'
import Result from '../@classes/Result'

export interface ICompiledResult {
  getKeyCount(): number
  getResultCount(): number
  getKeys(): {}
  getResults(): {}
  addKeys(key: Result | Result[]): CompiledResult
  addResults(result: Result | Result[]): CompiledResult
  compile(marks?: number, negativeMarks?: number): CompiledResult
  addFromExcel(src: string): CompiledResult
  export(): {}
}
