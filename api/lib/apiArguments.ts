import { Union } from 'knex'
import { NextApiRequest } from 'next'
import { checkToken } from '../apiAccount'
import { actionJson } from './apiUtil'
import { l } from '../../common/lib/lodash'

// export function getArguments<T, K>(req: NextApiRequest): T | K {

//   return await actionJson(req, res, action, user)
// }

export function getArgumentBoolean(req: NextApiRequest, key: string): boolean {
  let arg = req.body[key] as string | null | undefined | boolean
  if (l.isNil(key)) {
    return false
  }
  if (l.isString(arg)) {
    if (arg?.toLowerCase() === 'false') {
      return false
    }
    return true
  }
  if (l.isBoolean(arg)) {
    return arg
  }
  if (l.isNumber(arg)) {
    return arg > 0
  }
  return false
}
export function getArgumentString(req: NextApiRequest, key: string): string {
  let arg = req.body[key] as string | null | undefined
  return arg || ''
}

export function getArgumentInteger(
  req: NextApiRequest,
  key: string,
  _default = 0,
): number {
  let arg = req.body[key] as string | null | undefined
  if (l.isNil(arg)) {
    return _default
  }
  if (l.isNumber(arg)) {
    return arg
  }
  if (l.isString(arg)) {
    let number = parseInt(arg || '' + _default, 10)
    if (l.isNaN(number)) {
      return _default
    }
    return number
  }

  return _default
}
