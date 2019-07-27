import Result from '../@classes/Result'
import IAnswer from './IAnswer'
import IObject from './IObject'

interface IResult {
  answers: IAnswer
  rollNo: string | undefined
  imageFile: string | undefined
  post: string
  testCenter: string
  testTime: string
  questionPaperType: string
  addAnswer(title: string, value: string): Result
  getMarks(): number
  getTotalMarks(): number
  getCorrectCount(): number
  getInCorrectCount(): number
  getUnattemptedCount(): number
  getSkippedCount(): number
  isKey(): boolean
  isResult(): boolean
  hasValidRollNo(): boolean
  hasImageFile(): boolean
  matchWithKey(key: Result): boolean
  compile(key: Result, marks?: number, negativeMarks?: number): Result
  setMarks(marks: number, negativeMarks: number): void
  toJson(): IObject
}

export default IResult
