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
  const container = document.createElement('div')
  container.innerHTML += fs.readFileSync(options.train.source.designFile,
    'utf8')
  const svg = container.getElementsByTagName('svg')[0]

  const groups = svg.getElementsByTagName('g')
  for (let i = 0; i < groups.length; i += 1) {
    const title = groups[i].getElementsByTagName('title')[0].innerHTML
    if (title === 'RollNoBarcode') {
      console.log(groups[i])
    }
  }
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
  const resultFile = fs.readFileSync(options.train.source.designFile,
    'utf8')

  return resultFile
}

module.exports = {
  async train(opt) {
    const designData = await getDesignData()
    const results = await getResultData()
    const images = await getImagePaths()
  }
}
