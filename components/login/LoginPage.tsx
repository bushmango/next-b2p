import { Button } from '@/common/components/button'
import { Giphy } from '@/common/components/giphy/Giphy'
import { Input } from '@/common/components/input'
import { sosUser } from '@/state'
import { IStateUser } from '@/state/sosUser'
import Head from 'next/head'
import React from 'react'
import { NewsBox } from '../news/NewsBox'
import { Layout } from '../Layout'

export const LoginPage = () => {
  let state = sosUser.useSubscribe()

  return (
    <Layout title='Login'>
      <Head>
        <title>Login</title>
      </Head>
      <Login state={state} />
      <Logout state={state} />
      <NewsBox />
    </Layout>
  )
}

export const Logout = (props: { state: IStateUser }) => {
  let { state } = props
  if (!state.token) {
    return null
  }
  return (
    <div>
      <Button
        onClick={() => {
          sosUser.logout()
        }}
      >
        Logout
      </Button>
    </div>
  )
}

export const Login = (props: { state: IStateUser }) => {
  let { state } = props
  if (state.token) {
    return null
  }
  return (
    <div>
      <Giphy tag='love,thank you,lgbt,lgbtq,gay pride,trans pride,bisexual pride,books,library,rainbow' />
      <p>
        LGBT Books to Prisoners, use the same password and use this username:
        <br /> lgbtbookstoprisoners
      </p>
      Login
      <form>
        <div>
          Username:
          <Input
            autoComplete='username'
            value={state.username}
            onChange={(newVal) => {
              sosUser.updateForm({ username: newVal })
            }}
          />
        </div>
        <div>
          Password:
          <Input
            // autoComplete='current-password'
            inputType='password'
            // value={state.password}
            onChange={(newVal) => {
              sosUser.updateForm({ password: newVal })
            }}
          />
          <input
            type='hidden'
            name='password'
            autoComplete='current-password'
            value={state.password}
          />
        </div>
        <div>
          <Button
            submit
            onClick={(ev) => {
              sosUser.login()
              ev.preventDefault()
            }}
          >
            Login
          </Button>
        </div>
        <div>{state.requestLogin.error && <div>Invalid login!</div>}</div>
      </form>
    </div>
  )
}
