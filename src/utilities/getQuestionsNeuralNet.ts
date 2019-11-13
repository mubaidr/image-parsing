import brain, { INeuralNetworkJSON } from 'brain.js'
import fs from 'fs'

import { dataPaths } from './dataPaths'

function getQuestionsNeuralNet(): brain.NeuralNetwork {
  const text = fs.readFileSync(dataPaths.questionsModel).toString()
  const json: INeuralNetworkJSON = JSON.parse(text)
  return new brain.NeuralNetwork().fromJSON(json)
}

export { getQuestionsNeuralNet }