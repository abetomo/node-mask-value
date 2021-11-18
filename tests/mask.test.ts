import { masks, mask, Config } from '../src/mask'

// wip

describe('masks', () => {
  describe('simple', () => {
    test('object', () => {
      const data = {
        key: 'value'
      }
      const config: Config[] = [
        {
          path: '.key',
          action: () => 'hoge'
        }
      ]
      expect(masks(data, config))
        .toEqual({
          key: 'hoge'
        })
    })

    test('array', () => {
      const data = [1, 2, 3]
      const config: Config[] = [
        {
          path: '.[]',
          action: (n: number) => n * 2
        }
      ]
      expect(masks(data, config))
        .toEqual([2, 4, 6])
    })

    test('object with array', () => {
      const data = {
        items: [
          { key: 'value1' },
          { key: 'value2' }
        ]
      }
      const config: Config[] = [
        {
          path: '.items[].key',
          action: (v: string) => v + 'hoge'
        }
      ]
      expect(masks(data, config))
        .toEqual({
          items: [
            { key: 'value1hoge' },
            { key: 'value2hoge' }
          ]
        })
    })

    test('array with object', () => {
      const data = [
        { key: 'value1' },
        { key: 'value2' }
      ]
      const config: Config[] = [
        {
          path: '.[].key',
          action: (v: string) => v + 'hoge'
        }
      ]
      expect(masks(data, config))
        .toEqual([
          { key: 'value1hoge' },
          { key: 'value2hoge' }
        ])
    })
  })

  describe('deep', () => {
    test('complex', () => {
      const data = {
        id: 'XXX',
        items: [
          { key: 'value1' },
          { key: 'value2' },
          {
            key: 'value3',
            name: 'name3',
            description: {
              words: ['hoge', 'fuga', 'piyo']
            }
          }
        ],
        headers: {
          h1: 'title1',
          h2: 'title2'
        }
      }
      const config: Config[] = [
        {
          path: '.BBB[].key',
          action: (v: string) => v + 'BBB'
        },
        {
          path: '.items[].key',
          action: (v: string) => v + 'hoge'
        },
        {
          path: '.headers.h2',
          action: (v: string) => 'sub-' + v
        },
        {
          path: '.items[].description.words[]',
          action: () => '...'
        }
      ]
      expect(masks(data, config))
        .toEqual({
          id: 'XXX',
          items: [
            { key: 'value1hoge' },
            { key: 'value2hoge' },
            {
              key: 'value3hoge',
              name: 'name3',
              description: {
                words: ['...', '...', '...']
              }
            }
          ],
          headers: {
            h1: 'title1',
            h2: 'sub-title2'
          }
        })
    })
  })

  describe('Illegal values.', () => {
    test('data is null', () => {
      expect(masks(null, [{ path: '', action: () => {} }])).toBeNull()
    })

    test('path is empty', () => {
      expect(masks(
        { a: 1 },
        [{ path: '', action: () => {} }])
      )
        .toEqual({ a: 1 })
    })

    test('Illegal path', () => {
      const data = {
        key: 'hoge',
        items: 'not array',
        obj: {}
      }

      const config: Config[] = [
        {
          path: '.[]',
          action: () => 'test'
        },
        {
          path: '.items[]',
          action: () => 'test'
        },
        {
          path: '.obj[]',
          action: () => 'test'
        }
      ]
      expect(masks(data, config))
        .toEqual(data)
    })
  })
})

describe('mask', () => {
  // TODO

  describe('simple', () => {
    test('object', () => {
      const data = {
        key: 'value'
      }
      const config: Config = {
        path: '.key',
        action: () => 'hoge'
      }
      expect(mask(data, config))
        .toEqual({
          key: 'hoge'
        })
    })

    test('array', () => {
      const data = [1, 2, 3]
      const config: Config = {
        path: '.[]',
        action: (n: number) => n * 2
      }
      expect(mask(data, config))
        .toEqual([2, 4, 6])
    })

    test('object with array', () => {
      const data = {
        items: [
          { key: 'value1' },
          { key: 'value2' }
        ]
      }
      const config: Config = {
        path: '.items[].key',
        action: (v: string) => v + 'hoge'
      }
      expect(mask(data, config))
        .toEqual({
          items: [
            { key: 'value1hoge' },
            { key: 'value2hoge' }
          ]
        })
    })

    test('array with object', () => {
      const data = [
        { key: 'value1' },
        { key: 'value2' }
      ]
      const config: Config = {
        path: '.[].key',
        action: (v: string) => v + 'hoge'
      }
      expect(mask(data, config))
        .toEqual([
          { key: 'value1hoge' },
          { key: 'value2hoge' }
        ])
    })
  })
})
