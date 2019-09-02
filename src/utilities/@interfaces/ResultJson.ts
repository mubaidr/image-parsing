import AnswerCollection from './AnswerCollection'

interface ResultJson {
  [key: string]: string | object | undefined

  answers: AnswerCollection
}

export default ResultJson
