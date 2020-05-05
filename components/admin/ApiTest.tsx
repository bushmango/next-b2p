import React from 'react'
import { Button } from '../../common/components/button/Button'
import { IApiRequestState } from '../../common/lib/request/apiRequestState'

export const ApiTest = (props: {
  func: () => void
  label: string
  request: IApiRequestState<any>
}) => {
  return (
    <div>
      <Button
        onClick={() => {
          props.func()
        }}
      >
        {props.label}
      </Button>
      <pre>{JSON.stringify(props.request, null, 2)}</pre>
    </div>
  )
}
