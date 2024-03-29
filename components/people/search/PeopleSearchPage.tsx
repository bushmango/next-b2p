import Head from 'next/head'
import React from 'react'
import { sosUser } from '../../account/sosUser-sidecar'
import { Layout } from '../../layout/Layout'
import { PeopleSearch } from './PeopleSearch'

export const PeopleSearchPage = () => {
  if (!sosUser.ensureLoggedIn()) {
    return null
  }

  return (
    <Layout title='Search People'>
      <Head>
        <title>Search People</title>
      </Head>
      <PeopleSearch />
    </Layout>
  )
}
