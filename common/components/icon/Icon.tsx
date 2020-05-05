import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import styles from './Icon.module.scss'
import { regularIcons } from './regularIcons'
import { solidIcons } from './solidIcons'

export { regularIcons, solidIcons }

export const Icon = (props: { icon?: IconDefinition; className?: string }) => {
  return (
    <FontAwesomeIcon
      className={props.className}
      icon={props.icon || solidIcons.faCoffee}
    />
  )
}

export const IconButton = (props: {
  icon?: IconDefinition
  className?: string
  onClick: (ev: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode
  testId?: string
  inline?: boolean
}) => {
  let classname = styles.iconButton
  if (props.inline) {
    classname += '' + styles.inlineIcon
  }
  return (
    <div
      data-testid={props.testId}
      className={classname}
      onClick={props.onClick}
    >
      <Icon icon={props.icon} className={props.className} /> {props.children}
    </div>
  )
}
