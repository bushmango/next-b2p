import React from 'react'
import { Card } from '../../common/components/card/Card'
import { B2PGiphy } from '../../common/components/giphy/B2PGiphy'
import { InternalLink } from '../../common/components/internal-link/InternalLink'
import { Layout } from '../layout/Layout'
import css from './Home.module.scss'
import { Login, Logout } from '../login/LoginPage'
import { NewsBox } from '../news/NewsBox'
import { sosUser } from '../account/sosUser-sidecar'
import { ClientOnly } from '../ClientOnly'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'

export const HomePage = () => {
  let state = sosUser.useSubscribe()

  return (
    <Layout title='Home'>
      <div className={css.home}>
        <h2 className={css.homeHeader}>
          Welcome to the {b2pDebugDefs.organizationDisplayName} Database{' '}
        </h2>
        <div>{process.env.NEXT_PUBLIC_MOTD || '[MOTD placeholder]'}</div>

        <ClientOnly>
          <Card>
            <B2PGiphy />
          </Card>
        </ClientOnly>

        <ClientOnly>
          <Login state={state} />
          <Logout state={state} />
        </ClientOnly>
        <NewsBox />

        <InternalLink href='/login'>Login</InternalLink>
      </div>
    </Layout>
  )
}
