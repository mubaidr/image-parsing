import { toCamelCase, toHeadingCase } from '../../src/utilities/string'

describe('string', () => {
  test('should be defined', () => {
    expect(toCamelCase).toBeInstanceOf(Function)
    expect(toHeadingCase).toBeInstanceOf(Function)
  })

  test('should convert toCamelCase', async () => {
    const str = 'abc_abc-abc abc'

    expect(toCamelCase(str)).toBe('abcAbcAbcAbc')
  })

  test('should convert toHeadingCase', async () => {
    const str = 'abcAbcAbcAbc'

    expect(toHeadingCase(str)).toBe('ABC ABC ABC ABC')
  })
})
