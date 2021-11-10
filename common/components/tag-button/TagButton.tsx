import css from './TagButton.module.scss'
import React from 'react'
import { Badge } from '../badge/Badge'

export const TagButton = (props: {
  children?: React.ReactNode
  active: React.ReactNode
  inactive: React.ReactNode
  isActive: boolean
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) => {
  return (
    <div className={css.tagButton} onClick={props.onClick}>
      <Badge
        isActive={props.isActive}
        // color={props.isActive ? '#f4976C' : '#d2fdff'}
        // textColor={props.isActive ? 'black' : 'black'}
      >
        {props.isActive ? props.active : props.inactive}
      </Badge>
    </div>
  )
}
