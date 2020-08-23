import * as brain from 'brain.js'

import { getQuestionsNeuralNet } from '../../src/utilities/getQuestionsNeuralNet'

describe('getQuestionsNeuralNet', () => {
  test('should be defined', async () => {
    expect(getQuestionsNeuralNet).toBeInstanceOf(Function)
  })

  test('should return neural network json', async () => {
    const nnJson = getQuestionsNeuralNet()
    expect(nnJson).toBeInstanceOf(brain.NeuralNetwork)
  })
})
