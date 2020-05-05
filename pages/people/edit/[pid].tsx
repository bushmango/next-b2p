import { NextPage } from 'next'
import * as React from 'react'
import { PeopleEditPage } from '../../../components/people/PeopleEditPage-sidecar'
import { useRouter } from 'next/router'

const Page: NextPage = () => {
  const router = useRouter()
  const pid = router.query.pid as string
  return <PeopleEditPage pid={pid || ''} />
}

export default Page
