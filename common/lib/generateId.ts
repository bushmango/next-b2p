import { nanoid } from 'nanoid'
import * as uuid from 'uuid'
export const generateId = (): string => {
  return nanoid()
}

export const generateUuidV4 = (): string => {
  return uuid.v4()
}
