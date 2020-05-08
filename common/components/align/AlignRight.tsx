import React from 'react'
import css from './AlignRight.module.scss'
export const AlignRight = (props: { children: React.ReactNode }) => {
  return <div className={css.alignRight}>{props.children}</div>
}
