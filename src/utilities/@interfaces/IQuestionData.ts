interface IQuestionData {
  input: number[]
  output?: {
    [x: string]: number
  }
  title?: string
}

export default IQuestionData
