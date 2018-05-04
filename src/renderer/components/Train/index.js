const fs = require('fs')
const path = require('path')
const brain = require('brain.js')
const sharp = require('sharp')
const fastGlob = require('fast-glob')
const Store = require('electron-store')

import ('tracking')

const utilities = require('../../../utilities/utilities')

const net = new brain.NeuralNetwork()
const store = new Store()
const options = store.get('options')
const trainingData = []

async function getDesignData() {
  const designData = {
    questions: {}
  }
  const rollNoPattern = new RegExp(/rollnobarcode/)
  const questionPattern = new RegExp(/(q[1-9][0-9]?[ad])\b/gi) // Match roll and questions options a & d

  const container = document.createElement('div')
  container.innerHTML = fs.readFileSync(options.train.source.designFile, 'utf8')
  const svg = container.getElementsByTagName('svg')[0]
  const groups = svg.getElementsByTagName('g')

  designData.width = parseInt(svg.width.baseVal.value, 10)
  designData.height = parseInt(svg.height.baseVal.value, 10)

  let transform
  let x
  let y
  let width
  let height
  let optionTitle
  let QuestionNumber

  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i]
    const title = group
      .getElementsByTagName('title')[0]
      .innerHTML.trim()
      .toLowerCase()

    if (questionPattern.test(title)) {
      transform = group
        .getAttribute('transform')
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')
        .map(item => parseInt(item, 10))

      x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'), 10)
      y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'), 10)

      x += transform[0]
      y += transform[1]

      width = parseInt(
        group.getElementsByTagName('rect')[0].getAttribute('width'),
        10
      )
      height = parseInt(
        group.getElementsByTagName('rect')[0].getAttribute('height'),
        10
      )

      optionTitle = title.slice(-1)
      QuestionNumber = title.slice(0, -1)

      if (!designData.questions[QuestionNumber]) {
        designData.questions[QuestionNumber] = {}
      }

      if (optionTitle === 'a') {
        designData.questions[QuestionNumber].x1 = x
        designData.questions[QuestionNumber].y1 = y
      } else {
        designData.questions[QuestionNumber].x2 = x + width
        designData.questions[QuestionNumber].y2 = y + height
      }
    } else if (rollNoPattern.test(title)) {
      transform = group
        .getAttribute('transform')
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')
        .map(item => parseInt(item, 10))

      x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'), 10)
      y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'), 10)

      x += transform[0]
      y += transform[1]

      width = parseInt(
        group.getElementsByTagName('rect')[0].getAttribute('width'),
        10
      )
      height = parseInt(
        group.getElementsByTagName('rect')[0].getAttribute('height'),
        10
      )

      designData.rollNo = {
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
  const resultFile = fs.readFileSync(options.train.source.excelFile, 'utf8')

  const rows = resultFile.split('\n')
  const headerValues = rows[0].split(',')
  const rollNoIndex =
    headerValues.indexOf('RollNo') || headerValues.indexOf('RollNumber')

  let values
  let obj

  for (let i = 1; i < rows.length; i += 1) {
    values = rows[i].split(',')
    obj = {}

    for (let j = 0; j < values.length; j += 1) {
      obj[headerValues[j]] = values[j]
    }

    resultsData[values[rollNoIndex]] = obj
  }

  return resultsData
}

async function getImageOffset(path, width, height) {
  return new Promise((resolve, reject) => {
    const scaledImg = sharp(path)
      .resize(width, height)
      .png()
      .toBuffer()
      .then(data => {
        const img = new Image()
        img.id = 'myImage'
        // img.style.display = 'none!important'
        // img.style.visibility = 'hidden'
        img.onload = () => {
          console.log(tracking.Image.sobel(img, width, height))
          // tracking.track('#myImage', colors)
        }
        img.src = `data:image/png;base64,${data.toString('base64')}`
        document.body.appendChild(img)
      })
  })
}

module.exports = {
  async train(opt) {
    const designData = await getDesignData()
    const resultsData = await getResultData()
    const paths = await getImagePaths()

    // get offset details from first image
    const imageOffset = await getImageOffset(
      paths[0],
      designData.width,
      designData.height
    )

    const {
      rollNo,
      questions
    } = designData

    console.log(designData, imageOffset)

    paths.forEach(path => {
      const img = sharp(path).resize(designData.width, designData.height)

      img
        .extract({
          left: rollNo.x1,
          top: rollNo.y1,
          width: rollNo.x2 - rollNo.x1,
          height: rollNo.y2 - rollNo.y1
        })
        .toFormat('png')
        .toFile(`d:/tmp/some-${Math.random()}.png`, err => {
          if (err) console.log(err)
        })
    })
  }
}
