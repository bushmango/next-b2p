import Head from 'next/head'
import * as React from 'react'
import css from './Layout.module.scss'
import Link from 'next/link'

export const Layout = (props: { children: React.ReactNode; title: string }) => {
  return (
    <div className={css.layout}>
      <Head>
        <title>{props.title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <div className={css.header}>
        <Link href='/'>
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href='/rebreather'>
          <a>Rebreather</a>
        </Link>{' '}
        |{' '}
        <Link href='/game-of-life'>
          <a>Game of Life</a>
        </Link>{' '}
        |{' '}
        <Link href='/game-of-life-classic'>
          <a>Game of Life Classic</a>
        </Link>
      </div>
      {props.children}

      <footer>
        {/* <hr /> */}
        <span>&copy; 2020 Steve Bushman</span>
      </footer>
    </div>
  )
}
