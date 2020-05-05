import css from './Badge.module.scss'
import React from 'react'

export const Badge = (props: {
  children?: React.ReactNode
  color?: string
}) => {
  return (
    <div className={css.badge} style={{ backgroundColor: props.color }}>
      {props.children}
    </div>
  )
}
