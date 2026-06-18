import React from 'react'
import { Button } from '../../common/components/button/Button'
import { B2PGiphy } from '../../common/components/giphy/B2PGiphy'
import { Input } from '../../common/components/input/Input'
import { IStateUser } from '../account/sosUser'
import { sosUser } from '../account/sosUser-sidecar'
import { Layout } from '../layout/Layout'
import { NewsBox } from '../news/NewsBox'
import { Card } from '../../common/components/card/Card'
import { props } from 'ramda'
import { Stacked } from '../../common/components/stacked/Stacked'
import { Spacer } from '../spacer/Spacer'
import { AlignRight } from '../../common/components/align/AlignRight'
import { ClientOnly } from '../ClientOnly'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'

export const LoginPage = () => {
  let state = sosUser.useSubscribe()

  return (
    <Layout title='Login'>
      <ClientOnly>
        <Login state={state} />
        <Logout state={state} />
      </ClientOnly>
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
      <Card>
        <div>
          Currently logged in as:
          <div style={{ padding: '10px', fontWeight: 'bold' }}>
            {state.username}
          </div>
        </div>

        <B2PGiphy />

        <Button
          onClick={() => {
            sosUser.logout()
          }}
        >
          Logout
        </Button>
      </Card>
    </div>
  )
}

export const Login = (props: { state: IStateUser }) => {
  let { state } = props
  if (state.token) {
    return null
  }
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <Card>
        <B2PGiphy />
      </Card>

      <Card title='Login'>
        <form>
          <Stacked title='Username'>
            <Input
              autoComplete='username'
              value={state.username}
              onChange={(newVal) => {
                sosUser.updateForm({ username: newVal })
              }}
            />
          </Stacked>
          <Spacer />
          <Stacked title='Password'>
            <Input
              autoComplete='current-password'
              inputType='password'
              value={state.password}
              onChange={(newVal) => {
                console.log('merp')
                sosUser.updateForm({ password: newVal })
              }}
            />
            {/* <input
            type='hidden'
            name='password'
            autoComplete='current-password'
            value={state.password}
          /> */}
          </Stacked>
          <Spacer />

          <AlignRight>
            <Button
              submit
              onClick={(ev) => {
                sosUser.login()
                ev.preventDefault()
              }}
            >
              Login
            </Button>
          </AlignRight>

          <div>{state.requestLogin.error && <div>Invalid login!</div>}</div>
        </form>

        <p>
          {b2pDebugDefs.organizationDisplayName} use this username:
          <br /> lgbtbookstoprisoners
        </p>
      </Card>
    </div>
  )
}
