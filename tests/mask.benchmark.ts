import { masks, mask, Config } from '../src/mask'

// mask() benchmark
const data: { key: string }[] = [
  { key: 'value1' },
  { key: 'value2' }
]
const config: Config = {
  path: '.[].key',
  action: (v: string) => v + 'hoge'
}
console.time('mask() 10,000 times')
for (let i = 0; i < 10_000; i++) {
  mask(data, config)
}
console.timeEnd('mask() 10,000 times')

// masks() benchmark
const userList: { name: string, age: number}[] = [
  { name: 'name1', age: 1 },
  { name: 'name2', age: 2 }
]
const configList: Config[] = [
  {
    path: '.[].name',
    action: (v: string) => v + 'hoge'
  },
  {
    path: '.[].age',
    action: () => 999
  }
]
console.time('masks() 10,000 times')
for (let i = 0; i < 10_000; i++) {
  masks(userList, configList)
}
console.timeEnd('masks() 10,000 times')
