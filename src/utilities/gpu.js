/* eslint-disable func-names */

const Gpujs = require('gpu.js/src/browser.js')

const GPU = new Gpujs()

// sample script to convert image data array to binary
// this script takes 10x more times than CPU version DOH!

const innerFN = GPU.createKernel(function(data, ch) {
  // convert image data to binary
  const binaryData = []

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
})

function imageDataToBinary(arr, channels) {
  innerFN.setOutput([arr.length / channels])

  return innerFN(arr, channels)
}

module.exports = {
  imageDataToBinary,
}
