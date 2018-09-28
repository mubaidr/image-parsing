const brain = require('brain.js')
const sharp = require('sharp')
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
      path.join(dataPaths.testData, 'design.svg'),
    )

    expect(designData).toBeInstanceOf(Object)
    expect(designData.rollNo).toBeInstanceOf(Object)
    expect(designData.questions).toBeInstanceOf(Object)
    expect(designData.width).toBeGreaterThan(0)
    expect(designData.height).toBeGreaterThan(0)
  })

  test('getImagePaths', async () => {
    const imagePaths = await utilities.getImagePaths(
      path.join(dataPaths.testData, 'images'),
    )

    expect(imagePaths).toBeInstanceOf(Array)
  })

  test('getNeuralNet', () => {
    const neuralNet = utilities.getNeuralNet(dataPaths.trainingData)

    expect(neuralNet).toBeInstanceOf(brain.NeuralNetwork)
  })

  test('getDesignData', async () => {
    const designData = await utilities.getDesignData(
      path.join(dataPaths.testData, 'design.svg'),
    )

    expect(designData).toBeInstanceOf(Object)
    expect(designData.rollNo).toBeInstanceOf(Object)
    expect(designData.questions).toBeInstanceOf(Object)
    expect(Object.keys(designData.questions).length).toBe(60)
    expect(designData.width * designData.height).toBeDefined()
  })
})

/*
test('getQuestionsData', async () => {
  const sharpImage = sharp(path.join(dataPaths.testData, 'images', '10023.jpg'))
    .raw()
    .flatten()

  const questionsData = await utilities.getQuestionsData(
    path.join(dataPaths.testData, 'design.svg'),
    sharpImage,
    path.join(dataPaths.testData, 'result.csv'),
    10023,
  )

  console.log(questionsData)

  expect(questionsData).toBeInstanceOf(Object)
  expect(questionsData.rollNo).toBeInstanceOf(Object)
  expect(questionsData.questions).toBeInstanceOf(Object)
  expect(Object.keys(questionsData.questions).length).toBe(60)
  expect(questionsData.width * questionsData.height).toBeDefined()
})

test('getRollNoFromImage', async () => {
  const sharpImage = sharp(path.join(dataPaths.testData, 'images', '10023.jpg'))
    .raw()
    .flatten()

  const rollNo = await utilities.getRollNoFromImage(
    path.join(dataPaths.testData, 'design.svg'),
    sharpImage,
  )

  expect(rollNo).toBe(10023)
})
*/

test('readCsvToJson', () => {
  const output = utilities.readCsvToJson(
    path.join(dataPaths.testData, 'result.csv'),
  )

  expect(output).toBeInstanceOf(Object)
})

test('readJsonToCsv', () => {
  const output = utilities.readJsonToCsv({
    10023: {
      q1: 'a',
      q2: 'b',
      q3: 'c',
      q4: 'd',
    },
  })

  expect(output).toBeInstanceOf(String)
  expect(output).toBe('Q1,Q2,Q3,RollNo\\na,b,c,d,10023')
})
