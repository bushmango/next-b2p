import { NextPage } from 'next'
import * as React from 'react'

import { useRouter } from 'next/router'
import { PeopleEditPage } from '../../../components/people/edit/PeopleEditPage'

const Page: NextPage = () => {
  const router = useRouter()
  const pid = router.query.pid as string
  return <PeopleEditPage pid={pid || ''} />
}

export default Page
