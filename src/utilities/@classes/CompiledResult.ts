import uuid from 'uuid'

//store answer objects in list, easy tocalculate types

class Result {
  public option: string = ''
  public correct: boolean = false
  public incorrect: boolean = false
  public unattempted: boolean = false
  public skipped: boolean = false
}

class CompiledResult {
  private id: string = uuid()

  public center: string = ''
  public post: string = ''
  public rollNo: string = ''
  public time: string = ''
  public type: string = ''
  public imagePath: string = ''

  public list: Result[] = []

  //TODO: convert to methods
  // public attemptedAnswers: number = 0
  // public correctAnswers: number = 0
  // public incorrectAnswers: number = 0
  // public skippedAnswers: number = 0
  // public skippedQuestions: number = 0
  // public totalQuestions: number = 0

  // public unattemptedAnswersList: string[] = []
  // public correctAnswersList: string[] = []
  // public incorrectAnswersList: string[] = []
  // public skippedQuestionsList: string[] = []

  // public result: {
  //   [key: string]: string
  // } = {}

  public hasValidRollNo(): boolean {
    return this.rollNo !== ''
  }
}

export default CompiledResult
