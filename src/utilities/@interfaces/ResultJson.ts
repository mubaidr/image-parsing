import AnswerCollection from './AnswerCollection'

interface ResultJson {
  [key: string]: string | Record<string, unknown> | undefined

  answers: AnswerCollection
}

export default ResultJson
