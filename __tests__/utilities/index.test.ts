/**
 * @jest-environment @zeromake/jest-environment-jsdom-with-canvas
 */

import { NeuralNetwork } from 'brain.js'

import { convertToBitArray } from '../../src/utilities/convertToBitArray'
import { dataPaths } from '../../src/utilities/dataPaths'
import { getQuestionsNeuralNet } from '../../src/utilities/getQuestionsNeuralNet'
import { getSharpObjectFromSource } from '../../src/utilities/images'
import { readKey } from '../../src/utilities/readKey'

describe('convertToBitArray', () => {
  test('should be able to convert to bit data array', async () => {
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)
    const { data, info } = await sharpImg
      .extract({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      })
      .toBuffer({ resolveWithObject: true })

    const bitData = convertToBitArray(
      Array.prototype.slice.call(data, 0),
      info.channels,
    )

    expect(bitData.length).toBeGreaterThan(0)
    expect(bitData).toMatchSnapshot()
  })
})

describe('getQuestionsNeuralNet', () => {
  test('should be defined', async () => {
    expect(getQuestionsNeuralNet).toBeInstanceOf(Function)
  })

  test('should return neural network json', async () => {
    const nnJson = getQuestionsNeuralNet()
    expect(nnJson).toBeInstanceOf(NeuralNetwork)
  })
})

describe('readKey', () => {
  test('should read excel keys', async () => {
    const results = await readKey(dataPaths.key)
    if (!results) return

    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results[0]).toMatchSnapshot({
      id: expect.any(String),
      // imageFile: expect.any(String) || undefined,
    })
  })

  test('should read image keys', async () => {
    const results = await readKey(dataPaths.keyImage)
    if (!results) return

    expect(results.length).toBe(1)
    expect(results[0]).toMatchSnapshot({
      id: expect.any(String),
      imageFile: expect.anything(),
    })
  })
})
