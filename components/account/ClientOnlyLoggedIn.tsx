import React from 'react'
import { ClientOnly } from '../ClientOnly'
import { sosUser } from './sosUser-sidecar'

export const ClientOnlyLoggedIn = (props: { children: React.ReactNode }) => {
  return (
    <ClientOnly>
      <LoggedInOnly>{props.children}</LoggedInOnly>
    </ClientOnly>
  )
}

const LoggedInOnly = (props: { children: React.ReactNode }) => {
  if (!sosUser.ensureLoggedIn()) {
    return null
  }

  return <>{props.children}</>
}
