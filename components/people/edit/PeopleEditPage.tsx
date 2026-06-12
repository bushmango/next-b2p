import React from 'react'
import Head from 'next/head'

import { ClientOnlyLoggedIn } from '../../account/ClientOnlyLoggedIn'
import { Layout } from '../../layout/Layout'
import { EditPerson } from './EditPerson'

export const PeopleEditPage = (props: { pid: string }) => {
  return (
    <Layout title='Edit Person'>
      <Head>
        <title>Edit Person</title>
      </Head>
      <ClientOnlyLoggedIn>
        <EditPerson guid={props.pid} />
      </ClientOnlyLoggedIn>
    </Layout>
  )
}
