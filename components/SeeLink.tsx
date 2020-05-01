import Link from 'next/link'

export const SeeLink = (props: { href: string; children: React.ReactNode }) => {
  return (
    <div>
      <a href={props.href}>See: {props.children}</a>
    </div>
  )
}

export const SeeInternalLink = (props: {
  href: string
  children?: React.ReactNode
}) => {
  return (
    <div>
      <Link href={props.href}>
        <a>Related: {props.children || props.href}</a>
      </Link>
    </div>
  )
}
