import React from 'react'
import css from './Stacked.module.scss'
export const Stacked = (props: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <div className={css.stackedText}>{props.title}</div>
      <div>{props.children}</div>
    </div>
  )
}
