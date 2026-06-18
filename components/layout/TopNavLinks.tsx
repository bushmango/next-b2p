import React from 'react'
import { InternalLink } from '../../common/components/internal-link/InternalLink'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'
import { sosUser } from '../account/sosUser-sidecar'
import { ClientOnly } from '../ClientOnly'
import css from './Layout.module.scss'

export const TopNavLinks = () => {
  return (
    <div className={css.links}>
      <div className={css.link}>
        <InternalLink href='/'>Home</InternalLink>
      </div>
      <div className={css.link}>
        <InternalLink href='/about'>About</InternalLink>
      </div>
      <div className={css.link}>
        <InternalLink href='/news'>News</InternalLink>
      </div>
      <ClientOnly>
        <AuthLinks />
      </ClientOnly>
    </div>
  )
}

const AuthLinks = () => {
  const state = sosUser.useSubscribe()
  const isLoggedIn = !!state.token

  if (!isLoggedIn) {
    return (
      <div className={css.link}>
        <InternalLink href='/login'>Login</InternalLink>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className={css.link}>
        <InternalLink href='/people/search'>People Search</InternalLink>
      </div>
      <div className={css.link}>
        <InternalLink href='/reports'>Reports</InternalLink>
      </div>
      {b2pDebugDefs.featureFlag_allowStateRestrictionsPage && (
        <div className={css.link}>
          <InternalLink href='/state-restrictions'>
            State Restrictions
          </InternalLink>
        </div>
      )}
      <div className={css.link}>
        <InternalLink href='/admin'>Admin (Database Backup)</InternalLink>
      </div>
      <div className={css.link}>
        <InternalLink href='/login'>Logout</InternalLink>
      </div>
    </React.Fragment>
  )
}
