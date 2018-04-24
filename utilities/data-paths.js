const path = require('path')
const fs = require('fs')

module.exports = () => {
  const root = path.join('.')
  const src = path.join(root, 'src')
  const tmp = path.join(root, '.tmp')

  // create/clean tmp directory
  fs.mkdir(tmp, err => {
    if (err) console.log('Temp. directory already exists. \n')
  })

  return {
    tmp,
    root,
    src,
    main: path.join(src, 'main'),
    renderer: path.join(src, 'renderer'),
    utiltities: path.join(src, 'utiltities')
  }
}
