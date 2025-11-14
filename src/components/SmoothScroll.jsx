import { useEffect } from 'react'
import Lenis from 'lenis'

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,        // Animation duration (in seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      smooth: true,         // Enable smooth scrolling
      smoothTouch: false,   // Disable on touch devices (better performance on mobile)
      touchMultiplier: 2,   // Touch scroll speed multiplier
    })

    // Animation loop
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
