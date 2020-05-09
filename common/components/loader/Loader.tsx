import React from 'react'

import css from './Loader.module.scss'
import useAnimationForever from '../../../lib/useAnimationForever'
// import { useAnimationFrame } from '../hooks/useAnimationFrame'

export const Loader = (props: { isLoading?: boolean }) => {
  //return <div>Loading</div>
  return (
    <div className={css.infiniteLoader}>
      {/* <InfiniteLoaderInner /> */}
      {props.isLoading !== false && props.isLoading !== undefined && (
        <InfiniteLoaderInner />
      )}
    </div>
  )
}

const InfiniteLoaderInner = () => {
  const elapsed = useAnimationForever()

  let y = 0
  let delay = 0
  if (elapsed > delay) {
    let count = (elapsed - delay) / 60 / 20
    y = Math.tanh(count)
    // y = (1 - 1 / (count / 5 + 1)) * 100
  }

  return (
    <div>
      <div className={css.infiniteLoaderBar} style={{ width: y * 100 + '%' }} />
    </div>
  )
}
