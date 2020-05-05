import React from 'react'

export const Loading = (props: { isLoading: boolean | null | undefined }) => {
  if (!props.isLoading) {
    return null
  }
  return <div>Loading...</div>
}
