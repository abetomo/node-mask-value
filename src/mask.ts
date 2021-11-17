export interface Config {
  path: string
  action: Function
}

function maskMainForArray<T, U extends keyof T> (data: T[], pathNames: U[], action: Function): T[] {
  if (pathNames.length === 1) {
    for (let i = 0; i < data.length; i++) {
      data[i] = action(data[i])
    }
    return data
  }
  for (let i = 0; i < data.length; i++) {
    data[i] = maskMain(data[i], pathNames.slice(1), action)
  }
  return data
}

function maskMain<T, U extends keyof T> (data: T, pathNames: U[], action: Function): T {
  if (data == null) {
    return data
  }
  if (pathNames.length === 0) {
    return data
  }

  const bracketsIndex = (pathNames[0] as string).indexOf('[]')
  if (bracketsIndex < 0) {
    const key = pathNames[0]
    if (data[key] === undefined) {
      return data
    }
    if (pathNames.length === 1) {
      data[key] = action(data[key])
      return data
    }
    data[key] = maskMain(
      data[key] as T[U],
      pathNames.slice(1) as unknown as (keyof T[U])[],
      action
    )
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

  const key = (pathNames[0] as string).slice(0, bracketsIndex) as U
  if (data[key] === undefined) {
    return data
  }
  if (!Array.isArray(data[key])) {
    return data
  }

  data[key] = maskMainForArray(
    data[key] as unknown as T[U][],
    pathNames as unknown as (keyof T[U])[],
    action
  ) as unknown as T[U]
  return data
}

export function mask<T> (data: T, config: Config): T {
  return maskMain(
    data,
    config.path.split('.').slice(1) as(keyof T)[],
    config.action
  )
}

export function masks<T> (data: T, configList: Config[]): T {
  for (const config of configList) {
    data = mask(data, config)
  }
  return data
}
