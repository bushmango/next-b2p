import { ReactNode, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

export const ClientPortal = (props: {
  children: ReactNode
  className?: string
  id?: string
}) => {
  let container = useMemo(() => {
    if (typeof document === 'undefined') {
      return null
    }
    let el = document.createElement('div')
    if (props.className) {
      el.className = props.className
    }
    if (props.id) {
      el.id = props.id
    }
    return el
  }, [props.className, props.id])

  useEffect(() => {
    if (!container) {
      return
    }

    document.body.appendChild(container)

    return () => {
      document.body.removeChild(container)
    }
  }, [container])

  if (!container) {
    return null
  }

  return createPortal(props.children, container)
}
