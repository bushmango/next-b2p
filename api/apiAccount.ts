import * as express from 'express'
import { ping, postAnonymously } from './lib/apiUtil'

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

export function install(app: express.Express) {
  ping(app, '/api/account/ping')

  LGBTB2P_USERNAME = 'lgbtbookstoprisoners'
  LGBTB2P_PASSWORD = 'WeloveQueers!'
  LGBTB2P_TOKEN =
    'nfkzKq5jExjnB2jq6Y2TLNSLQVrSQmcETEUut3c5A4tpeC7wyjuHHbjgr8eJepgn'

  postAnonymously(app, '/api/account/login', async (req, _) => {
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

    // if (user) {
    //   return {
    //     username: user.un,
    //     token: user.token,
    //   }
    // } else {
    //   return {
    //     error: 'invalid-credentials',
    //   }
    // }
  })
}
