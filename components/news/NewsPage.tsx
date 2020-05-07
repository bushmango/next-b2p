import React from 'react'
import { Layout } from '../layout/Layout-sidecar'
import { NewsBox } from './NewsBox'

export const NewsPage = () => {
  return (
    <Layout title='News'>
      <NewsBox />
    </Layout>
  )
}
