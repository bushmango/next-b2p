import React from 'react'

import css from './Footer.module.scss'

export const Footer = () => {
  return (
    <div className={css.footer}>
      <div>&copy; 2015-2020 Stevie Bushman and LGBT Books to Prisoners</div>
      <div>
        For support / comments / inqueries contact : Stevie Bushman &ndash;
        stevie@steviebushman.com &ndash; 1.414.510.2140
      </div>
    </div>
  )
}
