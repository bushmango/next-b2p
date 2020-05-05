import React from 'react'

import styles from './Loader.module.scss'
// import { useAnimationFrame } from '../hooks/useAnimationFrame'

export const Loader = (props: { isLoading?: boolean }) => {
  return <div>Loading</div>
  // return (
  //   <div className={styles.infiniteLoader}>
  //     {props.isLoading !== false && <InfiniteLoaderInner />}
  //   </div>
  // )
}

// const InfiniteLoaderInner = () => {
//   const elapsed = useAnimationFrame()

//   let y = 0
//   let delay = 250
//   if (elapsed > delay) {
//     let count = (elapsed - delay) / 60
//     y = (1 - 1 / (count / 5 + 1)) * 100
//   }

//   return (
//     <div>
//       <div className={styles.infiniteLoaderBar} style={{ width: y + '%' }} />
//     </div>
//   )
// }
