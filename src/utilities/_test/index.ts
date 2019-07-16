import CompiledResult from '../@classes/CompiledResult'

const compiledResults = CompiledResult.fromExcel(
  './__tests__/test-data/result.xlsx'
)

compiledResults.forEach(compiledResult => {
  compiledResult.fromExcel('./__tests__/test-data/key.xlsx').compile()
  console.log(compiledResult.export())
})

// console.dir(compiledResults)
