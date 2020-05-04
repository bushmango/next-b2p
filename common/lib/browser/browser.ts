const _global = global as any
export const windowExists = typeof _global.window !== 'undefined'
export const documentExists = typeof _global.document !== 'undefined'
export const localStorageExists =
  windowExists && typeof _global.window.localStorage !== 'undefined'

export const getWindow = () => {
  if (windowExists) {
    return _global.window as Window
  }
  throw new Error(
    'Cannot get window in this context, please check windowExists first',
  )
}

export const getDocument = () => {
  if (documentExists) {
    return _global.document as Document
  }
  throw new Error(
    'Cannot get document in this context, please check documentExists first',
  )
}

export const getLocalStorage = () => {
  if (localStorageExists) {
    return _global.window.localStorage as Storage
  }
  throw new Error(
    'Cannot get localStorage in this context, please check localStorageExists first',
  )
}

export const getLocationHref = () => {
  if (windowExists) {
    return getWindow().location.href
  }
  return ''
}

export const reload = () => {
  if (windowExists) {
    getWindow().location.reload()
  }
}

export const windowOpen = (url: string, target?: '_blank') => {
  if (windowExists) {
    getWindow().open(url, target)
  }
}
