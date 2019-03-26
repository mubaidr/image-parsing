import brain, { INeuralNetworkJSON } from 'brain.js'
import fs from 'fs'

import { DATAPATHS } from './dataPaths'

type QuestionsNeuralNetGetter = () => brain.NeuralNetwork

const getQuestionsNeuralNet: QuestionsNeuralNetGetter = () => {
  const json: INeuralNetworkJSON = JSON.parse(
    fs.readFileSync(DATAPATHS.questionsModel).toString()
  )

  return new brain.NeuralNetwork().fromJSON(json)
}

type ConvertToBitArrayGetter = (a: number[], b: number) => number[]

const convertToBitArray: ConvertToBitArrayGetter = (data, channels) => {
  // Convert image data to binary
  const binaryData: number[] = []

  for (let i = 0; i < data.length; i += channels) {
    const threshold = 15
    const thresholdBlack = 80
    const [r, g, b, a] = data.slice(i, i + channels)
    const avg = Math.ceil(((r + g + b) * a) / (channels - 1))
    const upperLimit = avg + threshold
    const lowerLimit = avg - threshold

    if (avg <= thresholdBlack) {
      // Black pixel
      binaryData.push(0)
    } else if (
      r <= upperLimit &&
      r >= lowerLimit &&
      (g <= upperLimit && g >= lowerLimit) &&
      (b <= upperLimit && b >= lowerLimit)
    ) {
      // Grey pixel
      binaryData.push(1)
    } else {
      // Color pixel
      binaryData.push(0)
    }
  }

  return binaryData
}

module.exports = {
  convertToBitArray,
  getQuestionsNeuralNet,
}
