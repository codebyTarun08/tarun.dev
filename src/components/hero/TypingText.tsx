
"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface TypingTextProps {
  phrases: string[]
}

export function TypingText({ phrases }: TypingTextProps) {
  const [text, setText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [loopNum, setLoopNum] = React.useState(0)
  const [typingSpeed, setTypingSpeed] = React.useState(150)

  React.useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length
      const fullPhrase = phrases[i]

      if (isDeleting) {
        setText(fullPhrase.substring(0, text.length - 1))
        setTypingSpeed(50)
      } else {
        setText(fullPhrase.substring(0, text.length + 1))
        setTypingSpeed(100)
      }

      if (!isDeleting && text === fullPhrase) {
        setIsDeleting(true)
        setTypingSpeed(2000)
      } else if (isDeleting && text === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
        setTypingSpeed(500)
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed, phrases])

  return (
    <span className="text-xl md:text-2xl text-muted-foreground font-code">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[1.2em] bg-primary ml-1 align-middle"
      />
    </span>
  )
}
