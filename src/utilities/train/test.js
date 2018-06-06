const { fork, exec, execFile } = require('child_process')

// const forkedProcess = fork(`${__dirname}/src/utilities/train/test-child.js`, {})
// const forkedProcess = fork(`${__dirname}/test-child.js`)
const forkedProcess = exec(`node ${__dirname}/test-child.js`)
/*
forkedProcess.send({
  msg: 'got message',
})
*/
forkedProcess.on('disconnect', (code, signal) => {
  console.log(code, signal)
})

forkedProcess.on('error', (code, signal) => {
  console.log(code, signal)
})

forkedProcess.on('message', (code, signal) => {
  console.log(code, signal)
})

forkedProcess.on('exit', (code, signal) => {
  console.log(code, signal)
})

forkedProcess.on('close', (code, signal) => {
  console.log(code, signal)
})
