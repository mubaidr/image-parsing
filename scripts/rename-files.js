const fs = require('fs')

const dataPaths = require('../src/data-paths')

const optionPaths = ['a', 'b', 'c', 'd', 'e', 'none']

/* eslint-disable */
renameFiles(dataPaths.sample)
renameFiles(dataPaths.test)
/* eslint-enable */

function renameFiles(path) {
  optionPaths.forEach(optionPath => {
    const optionPathFull = path.join(path, optionPath)
    let isValidPath = false

    try {
      isValidPath = fs.accessSync(optionPathFull, fs.constants.R_OK)
    } catch (err) {
      console.log(`Path: '${optionPath}' does not exists.`)
    }

    if (isValidPath !== false) {
      fs.readdirSync(optionPathFull).forEach((file, index) => {
        fs.renameSync(
          path.join(optionPathFull, file),
          path.join(
            optionPathFull,
            `${Date.now() - index * (Math.random() * 10)}`
          )
        )
      })

      fs.readdirSync(optionPathFull).forEach((file, index) => {
        // get from file
        const extension = 'png'

        fs.renameSync(
          path.join(optionPathFull, file),
          path.join(optionPathFull, `${optionPath}-${index}.${extension}`)
        )
      })
    }
  })
}
