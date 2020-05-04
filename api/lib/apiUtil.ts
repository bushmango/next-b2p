import * as express from 'express'
import { checkToken, IUser } from '../apiAccount'

export function auth(
  req: express.Request,
  res: express.Response,
): IUser | null {
  const token =
    (req.query && req.query.token) || (req.body && req.body.token) || ''

  if (!token) {
    res.json({
      isError: true,
      error: 'no-token',
      errorType: 'no-token',
    })
    res.end()
    return null
  }

  let user = checkToken(token)
  if (!user) {
    res.json({
      isError: true,
      error: 'invalid-token',
      errorType: 'invalid-token',
    })
    res.end()
    return null
  }
  return user
}

export function post(
  app: express.Express,
  url: string,
  action: (req: express.Request, res: express.Response) => Promise<any>,
) {
  doPost(app, url, action, { allowAnonymous: false })
}

export function postAnonymously(
  app: express.Express,
  url: string,
  action: (req: express.Request, res: express.Response) => Promise<any>,
) {
  doPost(app, url, action, { allowAnonymous: true })
}

function doPost(
  app: express.Express,
  url: string,
  action: (req: express.Request, res: express.Response) => Promise<any>,
  options: { allowAnonymous: boolean },
) {
  app.post(url, async (req, res) => {
    if (!options.allowAnonymous) {
      res.locals.user = auth(req, res)
      if (!res.locals.user) {
        return
      }
    }
    try {
      let result = await action(req, res)

      if (result && result.error) {
        res.json(
          _.assign(
            {
              isError: true,
            },
            result,
          ),
        )
      }

      res.json(
        _.assign(
          {
            isSuccess: true,
          },
          result,
        ),
      )
    } catch (err) {
      res.json({
        isError: true,
        error: err,
        errorType: 'uncaught-exception',
      })
    }
  })
}

export function getTextFile(
  app: express.Express,
  url: string,
  action: (req: express.Request, res: express.Response) => Promise<any>,
) {
  doGetTextFile(app, url, action, { allowAnonymous: false })
}
function doGetTextFile(
  app: express.Express,
  url: string,
  action: (req: express.Request, res: express.Response) => Promise<any>,
  options: { allowAnonymous: boolean },
) {
  app.get(url, async (req, res) => {
    if (!options.allowAnonymous) {
      res.locals.user = auth(req, res)
      if (!res.locals.user) {
        return
      }
    }
    try {
      let result = await action(req, res)
      res.end(result)
    } catch (err) {
      res.json({
        isError: true,
        error: err,
        errorType: 'uncaught-exception',
      })
    }
  })
}

export function ping(app: express.Express, url: string) {
  app.get(url, (_, res) => res.send('pong:' + url))
}
