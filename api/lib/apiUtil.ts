import { NextApiRequest, NextApiResponse } from 'next'
import { checkToken, IUser } from '../apiAccount'
import { l } from '../../common/lib/lodash'

export function postJson(
  req: NextApiRequest,
  res: NextApiResponse,
  action: (req: NextApiRequest, user?: IUser | null) => any,
) {
  if (req.method !== 'POST') {
    res.status(200)
    res.send('not-allowed')
    return
  }

  const { token } = req.body

  let user = checkToken(token)
  if (!user) {
    res.status(200)
    res.send('not-logged-in') // TODO: better error
    return
  }

  return actionJson(req, res, action, user)
}

export function postAnonJson(
  req: NextApiRequest,
  res: NextApiResponse,
  action: (req: NextApiRequest, user?: IUser | null) => any,
) {
  if (req.method !== 'POST') {
    res.status(200)
    res.send('not-allowed')
    return
  }

  return actionJson(req, res, action, null)
}

export function actionJson(
  req: NextApiRequest,
  res: NextApiResponse,
  action: (req: NextApiRequest, user?: IUser | null) => any,
  user: IUser | null,
) {
  try {
    let result = action(req, user)

    if (!result || result.error) {
      res.status(200)
      res.json(
        l.assign(
          {
            isError: true,
          },
          result || {},
        ),
      )
    } else {
      res.status(200)
      res.json(
        l.assign(
          {
            isSuccess: true,
          },
          result,
        ),
      )
    }

    res.json(result)
  } catch (err) {
    console.log(err)
    res.json({ isError: true, error: 'unhandled-error' })
  }
}

// import * as express from 'express'
// import { checkToken, IUser } from '../apiAccount'
// import { NextApiRequest, NextApiResponse } from 'next'
// import { l } from '../../common/lib/lodash'

// export function auth(
//   req: express.Request,
//   res: express.Response,
// ): IUser | null {
//   const token =
//     (req.query && req.query.token) || (req.body && req.body.token) || ''

//   if (!token) {
//     res.json({
//       isError: true,
//       error: 'no-token',
//       errorType: 'no-token',
//     })
//     res.end()
//     return null
//   }

//   let user = checkToken(token)
//   if (!user) {
//     res.json({
//       isError: true,
//       error: 'invalid-token',
//       errorType: 'invalid-token',
//     })
//     res.end()
//     return null
//   }
//   return user
// }

// // export function post(
// //   app: express.Express,
// //   url: string,
// //   action: (req: express.Request, res: express.Response) => Promise<any>,
// // ) {
// //   doPost(app, url, action, { allowAnonymous: false })
// // }

// export function postAnonymouslyJson(
//   action: (req: NextApiRequest, res: NextApiResponse) => Promise<any>,
// ) {
//   return async (req: NextApiRequest, res: NextApiResponse) => {
//     await doPost(req, res, action, { allowAnonymous: true })
//   }
// }

// async function doPost(
//   req: NextApiRequest,
//   res: NextApiResponse,
//   action: (req: NextApiRequest, res: NextApiResponse) => Promise<any>,
//   options: { allowAnonymous: boolean },
// ) {
//   if (req.method !== 'POST') {
//     // Handle any other HTTP method
//     console.log('not-post')
//     // res.status(200)
//     res.send('not-allowed')
//   }

//   if (!options.allowAnonymous) {
//     // TODO: make sure we are logged in !!!
//     // res.locals.user = auth(req, res)
//     // if (!res.locals.user) {
//     //   return
//     // }
//   }
//   try {
//     let result = await action(req, res)
//     if (!result || result.error) {
//       console.log('error')
//       res.status(200)
//       res.json(
//         l.assign(
//           {
//             isError: true,
//           },
//           result || {},
//         ),
//       )
//     } else {
//       res.status(200)
//       res.json(
//         l.assign(
//           {
//             isSuccess: true,
//           },
//           result,
//         ),
//       )
//     }
//   } catch (err) {
//     res.status(200)
//     res.json({
//       isError: true,
//       error: err,
//       errorType: 'uncaught-exception',
//     })
//   }
// }

// // export function getTextFile(
// //   app: express.Express,
// //   url: string,
// //   action: (req: express.Request, res: express.Response) => Promise<any>,
// // ) {
// //   doGetTextFile(app, url, action, { allowAnonymous: false })
// // }
// // function doGetTextFile(
// //   app: express.Express,
// //   url: string,
// //   action: (req: express.Request, res: express.Response) => Promise<any>,
// //   options: { allowAnonymous: boolean },
// // ) {
// //   app.get(url, async (req, res) => {
// //     if (!options.allowAnonymous) {
// //       res.locals.user = auth(req, res)
// //       if (!res.locals.user) {
// //         return
// //       }
// //     }
// //     try {
// //       let result = await action(req, res)
// //       res.end(result)
// //     } catch (err) {
// //       res.json({
// //         isError: true,
// //         error: err,
// //         errorType: 'uncaught-exception',
// //       })
// //     }
// //   })
// // }

// // export function ping(app: express.Express, url: string) {
// //   app.get(url, (_, res) => res.send('pong:' + url))
// // }
