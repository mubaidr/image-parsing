import { cache } from '../../src/utilities/cache'

describe('cache', () => {
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
