import Head from 'next/head'
import React from 'react'
import { Icon, solidIcons } from '../../common/components/icon/Icon'
import { browser } from '../../common/lib/browser/browser-sidecar'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'
import css from './Redirect.module.scss'
export const Redirect = (props: {}) => {
  if (browser.windowExists) {
    let host = '' + browser.getWindow().location.host
    if (
      host.indexOf(b2pDebugDefs.productionHost) !== -1 ||
      host.indexOf('localhost') !== -1
    ) {
      return null
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Redirect &ndash; {b2pDebugDefs.appTitle}</title>
      </Head>

      <div className={css.redirect}>
        <div>
          This is a copy of the Books to Prisoners database. Please use the
          master copy:
        </div>
        <br />
        <Icon icon={solidIcons.faChevronRight} />{' '}
        <a href={b2pDebugDefs.productionUrl}>{b2pDebugDefs.productionUrl}</a>
      </div>
    </React.Fragment>
  )
}
