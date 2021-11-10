import React from 'react'
import { InternalLink } from '../../common/components/internal-link/InternalLink'
import { Layout } from '../layout/Layout'
import css from './Home.module.scss'
import { Login, Logout } from '../login/LoginPage'
import { NewsBox } from '../news/NewsBox'
import { sosUser } from '../account/sosUser-sidecar'

export const HomePage = () => {
  let state = sosUser.useSubscribe()

  return (
    <Layout title='Home'>
      <div className={css.home}>
        <h2 className={css.homeHeader}>
          Welcome to the LGBT Books to Prisoners Database
        </h2>

        <Login state={state} />
        <Logout state={state} />
        <NewsBox />

        <InternalLink href='/login'>Login</InternalLink>
      </div>
    </Layout>
  )
}
