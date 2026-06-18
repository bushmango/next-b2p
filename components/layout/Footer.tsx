import React from 'react'

import css from './Footer.module.scss'
import { Spacer } from '../spacer/Spacer'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'

export const Footer = () => {
  return (
    <div className={css.footer}>
      <div>
        &copy; {b2pDebugDefs.copyrightStartYear}-{b2pDebugDefs.copyrightEndYear}{' '}
        Stevie Bushman and {b2pDebugDefs.organizationDisplayName}
      </div>
      <Spacer />
      <div>
        For support / comments / inquiries contact : Stevie Bushman &ndash;{' '}
        {b2pDebugDefs.contactEmail} &ndash; {b2pDebugDefs.contactPhone}
      </div>
    </div>
  )
}
