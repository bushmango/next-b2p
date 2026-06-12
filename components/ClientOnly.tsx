import React from 'react'

export const ClientOnly = (props: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <>{props.children}</>
}
