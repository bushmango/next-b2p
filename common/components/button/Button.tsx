import React from 'react'

import css from './Button.module.scss'

export const Button = (props: {
  children: React.ReactNode
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  submit?: boolean
}) => {
  return (
    <button
      className={css.button}
      onClick={props.onClick}
      type={props.submit ? 'submit' : 'button'}
    >
      {props.children}
    </button>
  )
}
