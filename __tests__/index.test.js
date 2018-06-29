const path = require('path')
const utilities = require('../src/utilities')
const dataPaths = require('../src/utilities/data-paths')

describe('utilities', () => {
  test('createWorkerProcesses', async () => {
    const workers = await utilities.createWorkerProcesses(2)

    expect(workers).toBeInstanceOf(Array)
    expect(workers.length).toBeGreaterThan(0)
  })

  test('getDesignData', async () => {
    const designData = await utilities.getDesignData(
      path.join(dataPaths.testData, 'design.svg')
    )

    expect(designData).toBeInstanceOf(Object)
    expect(designData.rollNo).toBeInstanceOf(Object)
    expect(designData.questions).toBeInstanceOf(Object)
    expect(designData.width).toBeGreaterThan(0)
    expect(designData.height).toBeGreaterThan(0)
  })

  test('getImagePaths', async () => {
    const imagePaths = await utilities.getImagePaths(
      path.join(dataPaths.testData, 'images')
    )

    expect(imagePaths).toBeInstanceOf(Array)
  })

  test('getNeuralNet', () => {
    const neuralNet = utilities.getNeuralNet(
      path.join(dataPaths.testData, 'training-data.json')
    )

    expect(neuralNet).toBeInstanceOf(Function)
  })

  test('getQuestionsData', async () => {
    const getQuestionsData = await utilities.getQuestionsData(
      path.join(dataPaths.testData, 'design.svg')
    )

    expect(getQuestionsData).toBeInstanceOf(Function)
  })
})
