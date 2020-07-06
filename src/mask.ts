export interface Config {
  path: string
  action: Function
}

function maskMain (data: any, pathNames: string[], action: Function): any {
  if (data == null) {
    return data
  }
  if (pathNames.length === 0) {
    return data
  }

  const bracketsIndex = pathNames[0].indexOf('[]')
  if (bracketsIndex < 0) {
    const key = pathNames[0]
    if (data[key] === undefined) {
      return data
    }
    if (pathNames.length === 1) {
      data[key] = action(data[key])
      return data
    }
    data[key] = maskMain(data[key], pathNames.slice(1), action)
    return data
  }

  if (bracketsIndex === 0) {
    if (!Array.isArray(data)) {
      return data
    }

    if (pathNames.length === 1) {
      for (let i = 0; i < data.length; i++) {
        data[i] = action(data[i])
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i] = maskMain(data[i], pathNames.slice(1), action)
      }
    }
    return data
  }

  const key = pathNames[0].slice(0, bracketsIndex)
  if (data[key] === undefined) {
    return data
  }
  if (!Array.isArray(data[key])) {
    return data
  }

  if (pathNames.length === 1) {
    for (let i = 0; i < data[key].length; i++) {
      data[key][i] = action(data[key][i])
    }
    return data
  }
  for (let i = 0; i < data[key].length; i++) {
    data[key][i] = maskMain(data[key][i], pathNames.slice(1), action)
  }
  return data
}

export function mask (data: any, config: Config): any {
  return maskMain(data, config.path.split('.').slice(1), config.action)
}

export function masks (data: any, configList: Config[]): any {
  for (const config of configList) {
    data = mask(data, config)
  }
  return data
}
