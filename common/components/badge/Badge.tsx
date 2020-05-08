import css from './Badge.module.scss'
import React from 'react'

export const Badge = (props: {
  children?: React.ReactNode
  color?: string
  textColor?: string
}) => {
  return (
    <div
      className={css.badge}
      style={{
        backgroundColor: props.color || '#f4976C',
        color: props.textColor,
      }}
    >
      {props.children}
    </div>
  )
}
