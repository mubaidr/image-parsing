const brain = require('brain.js')

// let net = new brain.NeuralNetwork()

const net = new brain.recurrent.RNN()

net.train([
  { input: ['abcde'], output: ['a'] },
  { input: ['fghij'], output: ['f'] },
  { input: ['klmno'], output: ['k'] },
  { input: ['pqrst'], output: ['p'] },
  { input: ['uvwxyz'], output: ['u'] }
])

const output = net.run(['fghij']) // [0.987]

console.log('Result for ["fghij"] : ', output)
