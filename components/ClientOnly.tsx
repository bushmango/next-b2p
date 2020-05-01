import React from 'react'

export const ClientOnly = (props: { children: React.ReactNode }) => {
  let [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }
  })

  if (typeof window === 'undefined' || !isClient) {
    return null
  }

  return <>{props.children}</>
}
