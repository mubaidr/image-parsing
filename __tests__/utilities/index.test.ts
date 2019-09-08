/**
 * @jest-environment @zeromake/jest-environment-jsdom-with-canvas
 */

// import Result from '../../src/utilities/@classes/Result'
import { dataPaths } from '../../src/utilities/dataPaths'
import { getSharpObjectFromSource } from '../../src/utilities/images'
import { convertToBitArray, getQuestionsNeuralNet, readKey } from '../../src/utilities/index'

describe('convertToBitArray', () => {
  test('should be able to convert to bit data array', async () => {
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)
    const { data, info } = await sharpImg.toBuffer({ resolveWithObject: true })

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
    expect(nnJson).toMatchSnapshot()
  })
})

describe('readKey', () => {
  test('should read excel keys', async () => {
    const results = await readKey(dataPaths.key)
    if (!results) return

    expect(results.length).toBeGreaterThanOrEqual(1)

    results.forEach(result => {
      expect(result).toMatchSnapshot({ id: expect.any(String) })
    })
  })

  test('should read image keys', async () => {
    const results = await readKey(dataPaths.keyImage)
    if (!results) return

    expect(results.length).toBeGreaterThanOrEqual(1)
    results.forEach(result => {
      expect(result).toMatchSnapshot({ id: expect.any(String) })
    })
  })
})
