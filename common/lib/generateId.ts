import { nanoid } from 'nanoid'
import { v4 as uuidV4 } from 'uuid'

export const generateId = (): string => {
  return nanoid()
}

export const generateUuidV4 = (): string => {
  return uuidV4()
}
