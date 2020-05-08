import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import css from './InternalLink.module.scss'
export const InternalLink = (props: {
  href: string
  children?: React.ReactNode
}) => {
  const router = useRouter()
  const [hover, setHover] = useState(false)

  if (router.pathname === props.href) {
    return <div>{props.children || props.href}</div>
  }

  let className = ''
  if (hover) {
    className = css.active
  }

  return (
    <Link href={props.href}>
      <a
        className={className}
        onMouseEnter={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
        }}
      >
        {props.children || props.href}
      </a>
    </Link>
  )
}
