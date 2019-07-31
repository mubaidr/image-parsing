interface AnswerCollection {
  [key: string]: {
    value: string
    unattempted?: boolean
    correct?: boolean
    skipped?: boolean
  }
}

export default AnswerCollection
