const path = require('path')
const fs = require('fs')

const root = path.join(__dirname, '../..')
const src = path.join(root, 'src')
const tmp = path.join(root, '.tmp')

// create/clean tmp directory
fs.mkdir(tmp, err => {
  if (err) console.log('Temporary directory already exisits.')
})

module.exports = {
  root,
  src,
  tmp,
  main: path.join(src, 'main'),
  renderer: path.join(src, 'renderer'),
  utiltities: path.join(src, 'utiltities')
}
