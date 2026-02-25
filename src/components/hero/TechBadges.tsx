
"use client"

import { motion } from "framer-motion"

const BADGES = [
  { name: "React", top: "10%", left: "20%", delay: 0 },
  { name: "Next.js", top: "25%", left: "70%", delay: 0.2 },
  { name: "Python", top: "60%", left: "15%", delay: 0.4 },
  { name: "XGBoost", top: "80%", left: "60%", delay: 0.6 },
  { name: "NLP", top: "40%", left: "85%", delay: 0.8 },
  { name: "MERN", top: "15%", left: "45%", delay: 1.0 },
]

export function TechBadges() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {BADGES.map((badge) => (
        <motion.div
          key={badge.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.8,
            scale: 1,
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: badge.delay },
            scale: { duration: 0.5, delay: badge.delay },
            y: {
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            x: {
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{ top: badge.top, left: badge.left }}
          className="absolute hidden lg:block"
        >
          <div className="px-4 py-2 rounded-full glass border border-primary/20 bg-primary/5 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest shadow-lg shadow-primary/10">
            {badge.name}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
