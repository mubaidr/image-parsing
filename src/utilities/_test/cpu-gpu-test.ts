import { convertToBitArray } from '../index'
import { imageDataToBinary } from './gpu'

function test(): void {
  // random array 60 * 4 * 256 * 128
  const channels = 4
  const data = []

  for (let i = 0; i < 1024; i += 1) {
    data[i] = Math.ceil(Math.random() * 254)
  }

  const copyA = data.slice(0)
  const copyB = data.slice(0)

  console.time('cpu')
  const cpuData = convertToBitArray(copyA, channels)
  console.timeEnd('cpu')

  console.time('gpu')
  const gpuData = imageDataToBinary(copyB, channels)
  console.timeEnd('gpu')

  console.log(cpuData, gpuData)
}

test()

export { test }
