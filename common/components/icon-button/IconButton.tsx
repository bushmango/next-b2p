import React from 'react'
import css from './IconButton.module.scss'

export const IconButton = (props: {
  children?: React.ReactNode
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  tooltip?: string
}) => {
  return (
    <div
      className={css.iconButton}
      onClick={props.onClick}
      title={props.tooltip}
    >
      {props.children}
    </div>
  )
}
