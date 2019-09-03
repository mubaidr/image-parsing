const path = require('path')
const fs = require('fs')
const fg = require('fast-glob')

async function start() {
  const glob = path
    .join(__dirname, '..', '__tests__', '**/*.ts')
    .replace(/\\/g, '/')

  const filesPaths = fg.sync(glob, {
    onlyFiles: true,
    absolute: true,
    // deep: 10,
  })

  filesPaths.forEach(filePath => {
    // fs.renameSync(file, file.replace('.ts', '.test.ts'))
    // const fd = fs.openSync(filePath, 'w')
    // fs.writeFileSync(filePath, '')
    // fs.closeSync(fd)
  })
}

start()
