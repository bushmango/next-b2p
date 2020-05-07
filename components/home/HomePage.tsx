import React from 'react'
import { InternalLink } from '../../common/components/internal-link/InternalLink'
import { Layout } from '../layout/Layout-sidecar'
import css from './Home.module.scss'

export const HomePage = () => {
  return (
    <Layout title='Home'>
      <div className={css.home}>
        <div className={css.homeHeader}>
          <h2>Welcome to the LGBT Books to Prisoners Database</h2>
        </div>
        <InternalLink href='/login'>Login</InternalLink>
      </div>
    </Layout>
  )
}
