import Head from 'next/head'
import React from 'react'
import { ClientOnlyLoggedIn } from '../../account/ClientOnlyLoggedIn'
import { Layout } from '../../layout/Layout'
import { PeopleSearch } from './PeopleSearch'

export const PeopleSearchPage = () => {
  return (
    <Layout title='Search People'>
      <Head>
        <title>Search People</title>
      </Head>
      <ClientOnlyLoggedIn>
        <PeopleSearch />
      </ClientOnlyLoggedIn>
    </Layout>
  )
}
