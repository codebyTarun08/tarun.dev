"use client"

import * as React from "react"
import { motion } from "framer-motion"

/**
 * A high-performance animated background inspired by React Bits components.
 * Combines a subtle grid, animated radial gradients (auras), and floating particles.
 */
export function AnimatedBackground() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Animated Auras */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[140px]"
      />

      {/* Floating Particles (React Bits style) */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-100%"],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
          />
        ))}
      </div>
    </div>
  )
}
