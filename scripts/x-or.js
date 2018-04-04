const brain = require('brain.js')

let net = new brain.NeuralNetwork()

net.train([
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] }
])

let output = net.run([1, 0]) // [0.987]

console.log('X-OR for [1, 0] : ', output)

// create a simple recurrent neural network
net = new brain.recurrent.RNN()

net.train([
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] }
])

output = net.run([1, 0]) // [0]

console.log('X-OR for [1, 0] : ', output)
