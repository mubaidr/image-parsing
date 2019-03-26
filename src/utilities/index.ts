import brain from 'brain.js'
import fs from 'fs'

import { DATAPATHS } from './dataPaths'

type QuestionsNeuralNetGetter = (param: string) => brain.NeuralNetwork

/**
 *
 *
 * {string} src
 * {brain.NeuralNetwork}
 */
const getQuestionsNeuralNet: QuestionsNeuralNetGetter = (
  src: string
): brain.NeuralNetwork => {
  const net: brain.NeuralNetwork = new brain.NeuralNetwork()

  return net.fromJSON(
    JSON.parse(fs.readFileSync(src || DATAPATHS.questionsModel).toString())
  )
}

function convertToBitArray(data: number[], channels: number) {
  // Convert image data to binary
  const binaryData = []

  for (let i = 0; i < data.length; i += channels) {
    const r: number = data[i]
    const g: number = data[i + 1]
    const b: number = data[i + 2]
    const avg: number = Math.ceil((r + g + b) / 3)
    const threshold: number = 15
    const upperLimit: number = avg + threshold
    const lowerLimit: number = avg - threshold

    if (avg <= 80) {
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
