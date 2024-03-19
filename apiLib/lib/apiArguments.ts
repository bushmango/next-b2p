import { NextApiRequest } from 'next'
import { l } from '../../common/lib/lodash'

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
  let arg =
    (req.body[key] as string | null | undefined) ||
    (req.query[key] as string | null | undefined)
  return arg || ''
}

export function getArgumentJson(req: NextApiRequest, key: string): any {
  let arg = req.body[key] as any
  if (l.isString(arg)) {
    return JSON.parse(arg)
  }
  return arg
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
