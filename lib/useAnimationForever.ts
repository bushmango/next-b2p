import { useState, useEffect } from 'react'

export default function useAnimationForever() {
  const [elapsed, setTime] = useState(0)

  useEffect(() => {
    let animationFrame: number
    let start: number

    function onStart() {
      // Start the loop
      start = Date.now()
      loop()
    }

    // Function to be executed on each animation frame
    function onFrame() {
      setTime(Date.now() - start)
      loop()
    }

    // Call onFrame() on next animation frame
    function loop() {
      animationFrame = requestAnimationFrame(onFrame)
    }

    onStart()

    // Clean things up
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return elapsed
}
