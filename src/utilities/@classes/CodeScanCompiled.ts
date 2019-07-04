import CodeScan from './CodeScan'

class CodeSCanCompiled extends CodeScan {
  public totalQuestions: number = 0
  public skippedQuestions: number = 0
  public unattemptedAnswers: number = 0
  public attemptedAnswers: number = 0
  public correctAnswers: number = 0
  public incorrectAnswers: number = 0
  public unattemptedAnswersList: string[] = []
  public correctAnswersList: string[] = []
  public incorrectAnswersList: string[] = []
  public skippedQuestionsList: string[] = []
}

export default CodeSCanCompiled
