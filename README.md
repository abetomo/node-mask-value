# node-mask-value

[![npm version](https://badge.fury.io/js/%40abetomo%2Fmask-value.svg)](https://badge.fury.io/js/%40abetomo%2Fmask-value)
![Test](https://github.com/abetomo/node-mask-value/workflows/Test/badge.svg)

Mask the value of the object.

## Install

```
% npm i @abetomo/mask-value
```

## Examples

```typescript
import { mask, masks, Config } from '@abetomo/mask-value'

type User = {
  name: string
  address: string
}

const data: User[] = [
  {
    name: 'name1',
    address: 'address1'
  },
  {
    name: 'name2',
    address: 'address2'
  }
]

const config: Config = {
  path: '.[].name',
  action: () => Math.random()
}

console.log(mask<User[]>(data, config))
/*
Output:
[
  { name: 0.913236932864554, address: 'address1' },
  { name: 0.6970620876451457, address: 'address2' }
]
*/


const configs: Config[] = [
  {
    path: '.[].name',
    action: () => Math.random()
  },
  {
    path: '.[].address',
    action: (s: string) => s.length * Math.random()
  }
]

console.log(masks<User[]>(data, configs))
/*
Output:
[
  { name: 0.4253394097546368, address: 4.285149904757429 },
  { name: 0.7394228798993354, address: 6.334446902953465 }
]
*/
```
