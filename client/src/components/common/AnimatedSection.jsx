import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Scroll-triggered reveal wrapper.
 * Wraps children in a motion.div that fades + slides in when it enters the viewport.
 */
export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 28,
  duration = 0.75,
  once = true,
  margin = '-60px',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin })

  const initial = {
    opacity: 0,
    y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
    x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
  }

  const animate = inView ? { opacity: 1, y: 0, x: 0 } : initial

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
