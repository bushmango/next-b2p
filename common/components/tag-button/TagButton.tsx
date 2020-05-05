import css from './TagButton.module.scss'
import React from 'react'
import { Badge } from '../badge/Badge-sidecar'

export const TagButton = (props: {
  children?: React.ReactNode
  active: React.ReactNode
  inactive: React.ReactNode
  isActive: boolean
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) => {
  return (
    <div className={css.tagButton} onClick={props.onClick}>
      <Badge color={props.isActive ? 'blue' : 'grey'}>
        {props.isActive ? props.active : props.inactive}
      </Badge>
    </div>
  )
}
