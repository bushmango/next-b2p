import Link from 'next/link'

export const InternalLink = (props: {
  href: string
  children?: React.ReactNode
}) => {
  return (
    <Link href={props.href}>
      <a>{props.children || props.href}</a>
    </Link>
  )
}
