const path = require('path')
const fs = require('fs')

const root = path.resolve('.')
const src = path.join(root, 'src')
const tmp = path.join(root, '.tmp')
const trainingData = path.join(root, 'training-data')

if (fs.existsSync(tmp)) {
  fs.readdir(tmp, (err, files) => {
    if (err) console.log(err)

    // eslint-disable-next-line
    for (const file of files) {
      fs.unlink(path.join(tmp, file), err => {
        if (err) console.log(err)
      });
    }
  });
} else {
  fs.mkdir(tmp, err => {
    if (err) console.log(err)
  })
}

module.exports = {
  __paths: {
    tmp,
    root,
    src,
    trainingData,
    main: path.join(src, 'main'),
    renderer: path.join(src, 'renderer'),
    utiltities: path.join(src, 'utiltities')
  }
}
