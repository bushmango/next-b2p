import Head from 'next/head'
import React from 'react'
import { Icon, solidIcons } from '../../common/components/icon/Icon-sidecar'
import { browser } from '../../common/lib/browser/browser-sidecar'
import css from './Redirect.module.scss'
export const Redirect = (props: {}) => {
  if (browser.windowExists) {
    let host = '' + browser.getWindow().location.host
    if (
      host.indexOf('bookstoprisoners.steviebushman.com') !== -1 ||
      host.indexOf('localhost') !== -1
    ) {
      return null
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Redirect &ndash; Books to Prisoners Database</title>
      </Head>

      <div className={css.redirect}>
        <div>
          This is a copy of the Books to Prisoners database. Please use the
          master copy:
        </div>
        <br />
        <Icon icon={solidIcons.faChevronRight} />{' '}
        <a href='https://bookstoprisoners.steviebushman.com/'>
          https://bookstoprisoners.steviebushman.com/
        </a>
      </div>
    </React.Fragment>
  )
}
