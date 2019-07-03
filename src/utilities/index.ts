import brain, { INeuralNetworkJSON } from 'brain.js'
import fs from 'fs'
import { dataPaths } from './dataPaths'

type QuestionsNeuralNetGetter = () => brain.NeuralNetwork

const getQuestionsNeuralNet: QuestionsNeuralNetGetter = () => {
  const text = fs.readFileSync(dataPaths.questionsModel).toString()
  const json: INeuralNetworkJSON = JSON.parse(text)

  return new brain.NeuralNetwork().fromJSON(json)
}

type ConvertToBitArrayGetter = (a: number[], b: number) => number[]

const convertToBitArray: ConvertToBitArrayGetter = (data, channels) => {
  // Convert image data to binary
  const binaryData: number[] = []

  for (let i = 0; i < data.length; i += channels) {
    const threshold = 15
    const thresholdBlack = 80
    const [r, g, b] = data.slice(i, i + channels)
    // const avg = Math.ceil(((r + g + b) * a) / (channels - 1))
    const avg = Math.ceil((r + g + b) / channels)
    const upperLimit = avg + threshold
    const lowerLimit = avg - threshold

    if (avg <= thresholdBlack) {
      // Black pixel
      binaryData.push(0)
    } else if (
      r <= upperLimit &&
      r >= lowerLimit &&
      g <= upperLimit &&
      g >= lowerLimit &&
      b <= upperLimit &&
      b >= lowerLimit
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

export { convertToBitArray, getQuestionsNeuralNet }
