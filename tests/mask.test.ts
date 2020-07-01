import { masks } from '../src/mask'

// wip

describe('masks', () => {
  describe('simple', () => {
    test('object', () => {
      const data = {
        key: 'value'
      }
      const config = [
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
      const config = [
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
      const config = [
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
      const config = [
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
      const config = [
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
})

describe('mask', () => {
  // TODO
})
