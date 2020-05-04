// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
export const deepFreeze = <T>(object: T): T => {
  // Retrieve the property names defined on object
  let propNames = Object.getOwnPropertyNames(object)

  // Freeze properties before freezing self
  for (let name of propNames) {
    let value = (object as any)[name]

    if (!Object.isFrozen((object as any)[name])) {
      ;(object as any)[name] =
        value && typeof value === 'object' ? deepFreeze(value) : value
    }
  }

  return Object.freeze(object)
}
