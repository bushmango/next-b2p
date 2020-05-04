import { postAnonymouslyJson } from './lib/apiUtil'
import { NextApiRequest, NextApiResponse } from 'next'
import { l } from '../common/lib/lodash'

export interface IUser {
  organization: string
}

let { LGBTB2P_USERNAME, LGBTB2P_PASSWORD, LGBTB2P_TOKEN } = process.env

export function checkToken(token: string): IUser | null {
  // let user = l.find(secrets.users, (c) => c.token === token)
  // if (!user) {
  //   return null
  // }
  // return { organization: user.org }

  if (token === LGBTB2P_TOKEN) {
    return { organization: 'LGBTB2P' }
  }
  return null
}

export async function loginTest(req: NextApiRequest, res: NextApiResponse) {
  return postAnonJson(req, res, (req) => {
    const { username, password } = req.body
    if (!username) {
      return { error: 'no-username' }
    }
    if (!password) {
      return { error: 'no-password' }
    }
    username.toLowerCase()
    // let user = l.find(
    //   secrets.users,
    //   (c) => c.un.toLowerCase() === username && c.pw === password,
    // )

    if (username === LGBTB2P_USERNAME && password === LGBTB2P_PASSWORD) {
      return {
        username: LGBTB2P_USERNAME,
        token: LGBTB2P_TOKEN,
      }
    }
    return {
      error: 'invalid-credentials',
    }
  })

  // try {
  //   let doIt = () => {
  //     const { username, password } = req.body
  //     if (!username) {
  //       return { error: 'no-username' }
  //     }
  //     if (!password) {
  //       return { error: 'no-password' }
  //     }
  //     username.toLowerCase()
  //     // let user = l.find(
  //     //   secrets.users,
  //     //   (c) => c.un.toLowerCase() === username && c.pw === password,
  //     // )

  //     if (username === LGBTB2P_USERNAME && password === LGBTB2P_PASSWORD) {
  //       return {
  //         username: LGBTB2P_USERNAME,
  //         token: LGBTB2P_TOKEN,
  //       }
  //     }
  //     return {
  //       error: 'invalid-credentials',
  //     }
  //   }
  //   let result = doIt()
  //   res.json(result)
  // } catch (err) {
  //   console.log(err)
  //   res.json({ error: err })
  // }
}

export function postAnonJson(
  req: NextApiRequest,
  res: NextApiResponse,
  action: (req: NextApiRequest) => any,
) {
  if (req.method !== 'POST') {
    res.status(200)
    res.send('not-allowed')
    return
  }

  try {
    let result = action(req)

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

export const login = postAnonymouslyJson(async (req, res) => {
  const { username, password } = req.body
  username.toLowerCase()
  // let user = l.find(
  //   secrets.users,
  //   (c) => c.un.toLowerCase() === username && c.pw === password,
  // )

  if (username === LGBTB2P_USERNAME && password === LGBTB2P_PASSWORD) {
    return {
      username: LGBTB2P_USERNAME,
      token: LGBTB2P_TOKEN,
    }
  }
  return {
    error: 'invalid-credentials',
  }
})

// export function install(app: express.Express) {
//   ping(app, '/api/account/ping')

//   postAnonymously(app, '/api/account/login', async (req, _) => {
//     const { username, password } = req.body
//     username.toLowerCase()
//     // let user = l.find(
//     //   secrets.users,
//     //   (c) => c.un.toLowerCase() === username && c.pw === password,
//     // )

//     if (username === LGBTB2P_USERNAME && password === LGBTB2P_PASSWORD) {
//       return {
//         username: LGBTB2P_USERNAME,
//         token: LGBTB2P_TOKEN,
//       }
//     }
//     return {
//       error: 'invalid-credentials',
//     }

//     // if (user) {
//     //   return {
//     //     username: user.un,
//     //     token: user.token,
//     //   }
//     // } else {
//     //   return {
//     //     error: 'invalid-credentials',
//     //   }
//     // }
//   })
// }
