import ICodeScan from './ICodeScan'

interface ICodeScanCompiled extends ICodeScan {
  totalQuestions: number
  skippedQuestions: number
  unattemptedAnswers: number
  attemptedAnswers: number
  correctAnswers: number
  incorrectAnswers: number
  unattemptedAnswersList: string[]
  correctAnswersList: string[]
  incorrectAnswersList: string[]
  skippedQuestionsList: string[]
}

export default ICodeScanCompiled

//TODO: implement and use classes
