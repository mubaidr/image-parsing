import Cache from '../../../src/utilities/@classes/Cache'

const cache = new Cache()

describe('Cache', () => {
  test('should be defined', () => {
    expect(cache).toBeDefined()
    expect(cache.get).toBeDefined()
    expect(cache.set).toBeDefined()
    expect(cache.remove).toBeDefined()
    expect(cache.reset).toBeDefined()
  })

  test('works', () => {
    expect(cache.get('key')).toBeUndefined()
    cache.set('key', 'value')
    expect(cache.get('key')).toBe('value')
    cache.remove('key')
    expect(cache.get('key')).toBeUndefined()
    cache.set('key', 'value')
    expect(cache.get('key')).toBe('value')
    cache.reset()
    expect(cache.get('key')).toBeUndefined()
  })
})
