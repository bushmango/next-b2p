import { NextApiRequest, NextApiResponse } from 'next'
import { postAnonJson } from './lib/apiUtil'

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
    return { organization: 'madison-lgbt-b2p' }
  }
  return null
}

export async function login(req: NextApiRequest, res: NextApiResponse) {
  return postAnonJson(req, res, async (req) => {
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

// export const login = postAnonymouslyJson(async (req, res) => {
//   const { username, password } = req.body
//   username.toLowerCase()
//   // let user = l.find(
//   //   secrets.users,
//   //   (c) => c.un.toLowerCase() === username && c.pw === password,
//   // )

//   if (username === LGBTB2P_USERNAME && password === LGBTB2P_PASSWORD) {
//     return {
//       username: LGBTB2P_USERNAME,
//       token: LGBTB2P_TOKEN,
//     }
//   }
//   return {
//     error: 'invalid-credentials',
//   }
// })

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
