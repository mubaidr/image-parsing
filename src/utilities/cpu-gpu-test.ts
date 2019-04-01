import { imageDataToBinary } from './gpu'
import { convertToBitArray } from './index'

function test() {
  // random array 60 * 4 * 256 * 128
  const channels = 4
  const data = []

  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.ceil(Math.random() * 254)
  }

  console.time('cpu')
  const cpuData = convertToBitArray(data, channels)
  console.timeEnd('cpu')

  console.time('gpu')
  const gpuData = imageDataToBinary(data, channels)
  console.timeEnd('gpu')

  console.log(cpuData, gpuData)
}

export { test }
