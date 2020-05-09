import Head from 'next/head'
import React from 'react'
import { InternalLink } from '../../common/components/internal-link/InternalLink'
import { sosUser } from '../account/sosUser-sidecar'
import { ClientOnly } from '../ClientOnly'
import cssPrint from '../people/print/Print.module.scss'
import { Footer } from './Footer-sidecar'
import css from './Layout.module.scss'
import { Redirect } from './Redirect'

export const Layout = (props: {
  children: React.ReactNode
  title?: string
}) => {
  const state = sosUser.useSubscribe()
  let isLoggedIn = !!state.token

  return (
    <React.Fragment>
      {props.title && (
        <Head>
          <title>{props.title} &ndash; Books to Prisoners Database</title>
        </Head>
      )}

      <ClientOnly>
        <Redirect />
      </ClientOnly>

      <div className={cssPrint.notPrintable}>
        <div className={css.headerBar}>
          <div className={css.title}>Books to Prisoners Database</div>

          <div className={css.links}>
            <div className={css.link}>
              <InternalLink href='/'>Home</InternalLink>
            </div>
            <div className={css.link}>
              <InternalLink href='/about'>About</InternalLink>
            </div>
            <div className={css.link}>
              <InternalLink href='/news'>News</InternalLink>
            </div>
            {isLoggedIn && (
              <React.Fragment>
                <div className={css.link}>
                  <InternalLink href='/people/search'>
                    People Search
                  </InternalLink>
                </div>
                {/* <div className={classes.link}>
              <RazLink to='/books/search'>Book Search</RazLink>
            </div> */}
                {/* <div className={classes.link}>
              <RazLink to='/api-test'>Api Test</RazLink>
            </div> */}
                {/* <div className={css.link}>
                  <InternalLink href='/admin'>Admin</InternalLink>
                </div> */}
                <div className={css.link}>
                  <InternalLink href='/login'>Logout</InternalLink>
                </div>
              </React.Fragment>
            )}
            {!isLoggedIn && (
              <React.Fragment>
                <div className={css.link}>
                  <InternalLink href='/login'>Login</InternalLink>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        <div className={css.body}>{props.children}</div>
        <div>
          <Footer />
        </div>
      </div>
    </React.Fragment>
  )
}

// export const Layout = (props: { children: React.ReactNode; title: string }) => {
//   return (
//     <div className={css.layout}>
//       <Head>
//         <title>{props.title}</title>
//         <meta charSet='utf-8' />
//         <meta name='viewport' content='initial-scale=1.0, width=device-width' />
//       </Head>

//       <div className={css.header}>
//         <Link href='/'>
//           <a>Home</a>
//         </Link>{' '}
//         |{' '}
//         <Link href='/login'>
//           <a>Login</a>
//         </Link>{' '}
//         |{' '}
//         <Link href='/people/search'>
//           <a>People Search</a>
//         </Link>
//       </div>
//       {props.children}

//       <footer>
//         {/* <hr /> */}
//         <span>&copy; 2020 Steve Bushman</span>
//       </footer>
//     </div>
//   )
// }
