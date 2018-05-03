const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const sharp = require('sharp')
const fastGlob = require('fast-glob')
const Store = require('electron-store')

const utilities = require('../../../utilities/utilities')

const net = new brain.NeuralNetwork()
const store = new Store()
const options = store.get('options')
const trainingData = []

async function getDesignData() {
  const designData = {}
  const rollNoPattern = new RegExp(/rollnobarcode/)
  const questionPattern = new RegExp(/(q[1-9][0-9]?[ad])\b/ig) // Match roll and questions options a & d

  const container = document.createElement('div')
  container.innerHTML = fs.readFileSync(options.train.source.designFile, 'utf8')
  const svg = container.getElementsByTagName('svg')[0]
  const groups = svg.getElementsByTagName('g')

  let transform
  let x
  let y
  let width
  let height
  let optionTitle
  let QuestionNumber

  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i]
    const title = group.getElementsByTagName('title')[0].innerHTML.trim().toLowerCase()

    if (questionPattern.test(title)) {
      transform = group
        .getAttribute('transform')
        .replace(/(translate)|\(|\)/ig, '')
        .split(',')
        .map(item => parseInt(item, 10))

      x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'), 10)
      y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'), 10)

      x += transform[0]
      y += transform[1]

      width = parseInt(group.getElementsByTagName('rect')[0].getAttribute(
        'width'), 10)
      height = parseInt(group.getElementsByTagName('rect')[0].getAttribute(
        'height'), 10)

      optionTitle = title.slice(-1)
      QuestionNumber = title.slice(0, -1)

      if (!designData[QuestionNumber]) {
        designData[QuestionNumber] = {}
      }

      if (optionTitle === 'a') {
        designData[QuestionNumber].x1 = x
        designData[QuestionNumber].y1 = y
      } else {
        designData[QuestionNumber].x2 = x + width
        designData[QuestionNumber].y2 = y + height
      }
    } else if (rollNoPattern.test(title)) {
      transform = group
        .getAttribute('transform')
        .replace(/(translate)|\(|\)/ig, '')
        .split(',')
        .map(item => parseInt(item, 10))

      x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'), 10)
      y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'), 10)

      x += transform[0]
      y += transform[1]

      width = parseInt(group.getElementsByTagName('rect')[0].getAttribute(
        'width'), 10)
      height = parseInt(group.getElementsByTagName('rect')[0].getAttribute(
        'height'), 10)

      designData[title] = {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + height
      }
    }
  }

  return designData
}

// get Images
async function getImagePaths() {
  return fastGlob(
    `${options.train.source.image}/*.{${options.validFormats.image.join(',')}}`, {
      onlyFiles: true
    }
  )
}

// Load results csv
async function getResultData() {
  const resultsData = {}
  const resultFile = fs.readFileSync(options.train.source.designFile,
    'utf8')

  return resultsData
}

module.exports = {
  async train(opt) {
    const designData = await getDesignData()
    const resultsData = await getResultData()
    const images = await getImagePaths()

    console.log(resultsData)
  }
}
