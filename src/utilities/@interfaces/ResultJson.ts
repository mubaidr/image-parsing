interface ResultJson {
  [key: string]: string | object | undefined

  answers: {
    [key: string]: string | object
    value: string
  }
}

export default ResultJson
