import css from './Badge.module.scss'
import React from 'react'

export const Badge = (props: {
  children?: React.ReactNode
  isActive?: boolean
  // color?: string
  // textColor?: string
}) => {
  let className = css.badge
  if (props.isActive) {
    className += ' ' + css.active
  }

  return <div className={className}>{props.children}</div>
}
