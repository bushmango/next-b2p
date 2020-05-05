import React from 'react'
import Head from 'next/head'

import { sosUser } from '../../account/sosUser-sidecar'
import { Layout } from '../../Layout'
import { EditPerson } from './EditPerson-sidecar'

export const PeopleEditPage = (props: { pid: string }) => {
  if (!sosUser.ensureLoggedIn()) {
    return null
  }

  return (
    <Layout title='Edit Person'>
      <Head>
        <title>Edit Person</title>
      </Head>
      <EditPerson guid={props.pid} />
    </Layout>
  )
}
