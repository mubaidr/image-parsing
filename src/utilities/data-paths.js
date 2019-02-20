const fs = require('fs')
const path = require('path')

const tmp = path.resolve('.tmp')

fs.exists(tmp, exist => {
  if (exist) {
    fs.readdir(tmp, (err, files) => {
      if (err) console.log(err)

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]

        fs.unlink(path.join(tmp, file), error => {
          if (error) console.log(error)
        })
      }
    })
  } else {
    fs.mkdir(tmp, err => {
      if (err) console.log(err)
    })
  }
})

module.exports = {
  tmp: path.resolve('.tmp'),
  root: path.resolve('.'),
  src: path.resolve('src'),
  trainingData: path.resolve('src/data/training-data.json'),
  main: path.resolve('src/main'),
  renderer: path.resolve('src/renderer'),
  utiltities: path.resolve('src/utilities'),
  testData: path.resolve('__tests__/test-data'),
  DEFAULTS: {
    design: path.resolve('__tests__/test-data', 'design.svg'),
    images: path.resolve('__tests__/test-data', 'images'),
    result: path.resolve('__tests__/test-data', 'result.csv'),
    questionsModel: path.resolve('src/data/questions-model.json'),
    rollNoModel: path.resolve('src/data/questions-model.json'),
    postModel: path.resolve('src/data/questions-model.json'),
    centreModel: path.resolve('src/data/questions-model.json'),
  },
}
