const path = require('path')
const fs = require('fs')

const tmp = path.resolve('.tmp')

if (fs.existsSync(tmp)) {
  fs.readdir(tmp, (err, files) => {
    if (err) console.log(err)

    // eslint-disable-next-line
    for (const file of files) {
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

module.exports = {
  tmp: path.resolve('.tmp'),
  root: path.resolve('.'),
  src: path.resolve('src'),
  trainingData: path.resolve('src/data/training-data.json'),
  main: path.resolve('src/main'),
  renderer: path.resolve('src/renderer'),
  utiltities: path.resolve('src/utilities'),
  testData: path.resolve('__tests__/test-data'),
}
