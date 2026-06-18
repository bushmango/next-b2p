import Head from 'next/head'
import React from 'react'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'
import { ClientOnly } from '../ClientOnly'
import cssPrint from '../people/print/Print.module.scss'
import { Footer } from './Footer'
import css from './Layout.module.scss'
import { MaintenancePage } from './MaintenancePage'
import { Redirect } from './Redirect'
import { TopNavLinks } from './TopNavLinks'

export const Layout = (props: {
  children: React.ReactNode
  title?: string
}) => {
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

          <TopNavLinks />
        </div>
        <div className={css.body}>
          {b2pDebugDefs.featureFlag_maintenanceMode ? (
            <MaintenancePage />
          ) : (
            props.children
          )}
        </div>
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
