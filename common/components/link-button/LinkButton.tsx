import React from 'react'
import css from './LinkButton.module.scss'

export const LinkButton = (props: {
  children: React.ReactNode
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}) => {
  return (
    <a
      href='javascript: void(0)'
      className={css.linkButton}
      onClick={props.onClick}
    >
      {props.children}
    </a>
  )
}
