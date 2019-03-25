import brain = require('brain.js')
import fs = require('fs')

import DATAPATHS from './data-paths'

/**
 * Returns a trained neural network function
 *
 * @returns {Function} Neural network function
 */
function getQuestionsNeuralNet(src: string) {
  const net = new brain.NeuralNetwork()

  return net.fromJSON(
    JSON.parse(fs.readFileSync(src || DATAPATHS.questionsModel).toString())
  )
}

/**
 * Converts provided Raw image data to Bit array
 * @param {Array<Number>} data Raw image pixel data array
 * @param {Number} channels Number of channels in the data
 */
function convertToBitArray(data: number[], channels: number) {
  // convert image data to binary
  const binaryData = []

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const avg = Math.ceil((r + g + b) / 3)
    const threshold = 15
    const upperLimit = avg + threshold
    const lowerLimit = avg - threshold

    if (avg <= 80) {
      // black pixel
      binaryData.push(0)
    } else if (
      r <= upperLimit &&
      r >= lowerLimit &&
      (g <= upperLimit && g >= lowerLimit) &&
      (b <= upperLimit && b >= lowerLimit)
    ) {
      // grey pixel
      binaryData.push(1)
    } else {
      // color pixel
      binaryData.push(0)
    }
  }

  return binaryData
}

module.exports = {
  convertToBitArray,
  getQuestionsNeuralNet,
}
