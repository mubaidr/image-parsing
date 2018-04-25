const path = require('path')
const fs = require('fs')

module.exports = () => {
  const root = path.resolve('.')
  const src = path.join(root, 'src')
  const tmp = path.join(root, '.tmp')

  if (fs.existsSync(tmp)) {
    fs.readdir(tmp, (err, files) => {
      if (err) console.log(err)

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

  return {
    tmp,
    root,
    src,
    main: path.join(src, 'main'),
    renderer: path.join(src, 'renderer'),
    utiltities: path.join(src, 'utiltities')
  }
}
