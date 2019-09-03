/* eslint-disable */

import { GPU } from 'gpu.js'

const gpu = new GPU()

function arrayToBinary(data: number[], ch: number): number[] {
  // convert image data to binary
  const binaryData = Array()

  for (let i = 0; i < data.length; i += ch) {
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

const innerFN = gpu.createKernel(arrayToBinary)

function imageDataToBinary(arr: number[], channels: number) {
  return innerFN.setOutput([arr.length / channels])(arr, channels)
}

export { imageDataToBinary }
