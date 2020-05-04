import React from 'react'

import classes from './Button.module.scss'

export const Button = (props: {
  children: React.ReactNode
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  submit?: boolean
}) => {
  return (
    <button
      className={classes.button}
      onClick={props.onClick}
      type={props.submit ? 'submit' : 'button'}
    >
      {props.children}
    </button>
  )
}
