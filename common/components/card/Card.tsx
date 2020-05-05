import React from 'react'
import css from './Card.module.scss'

export const Card = (props: {
  children: React.ReactNode
  title?: React.ReactNode
  minWidth?: string
  minHeight?: string
}) => {
  return (
    <div
      className={css.card}
      style={{ minWidth: props.minWidth, minHeight: props.minHeight }}
    >
      {props.title && (
        <div className={css.title + ' ' + css.bordered}>{props.title}</div>
      )}

      {props.children}
    </div>
  )
}
