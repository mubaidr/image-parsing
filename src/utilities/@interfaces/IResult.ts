import IAnswer from './IAnswer'

interface IResult {
  answers: IAnswer
  rollNo: string | undefined
  imageFile: string | undefined
  post: string
  testCenter: string
  testTime: string
  questionPaperType: string
}

export default IResult
