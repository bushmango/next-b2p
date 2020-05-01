import Link from 'next/link'

export const ZenLink = (props: { href: string }) => {
  return (
    <div>
      <Link href={props.href}>
        <a>Zen</a>
      </Link>
    </div>
  )
}
