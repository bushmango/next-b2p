import React from 'react'
import { Layout } from '../Layout-sidecar'
import { NewsBox } from './NewsBox'

export const NewsPage = () => {
  return (
    <Layout title='News'>
      <NewsBox />
    </Layout>
  )
}
