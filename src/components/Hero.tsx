
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2 } from "lucide-react"
import { ResumeButton } from "./ResumeButton"

export function Hero() {
  const [text, setText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [loopNum, setLoopNum] = React.useState(0)
  const [typingSpeed, setTypingSpeed] = React.useState(150)

  const phrases = React.useMemo(() => [
    "Building Digital Experiences with Precision.",
    "Fullstack & AI Engineering Specialist.",
    "Turning Complex Ideas into Elegant Code.",
    "Architecting Scalable Web Solutions."
  ], [])

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
        setTypingSpeed(2000) // Pause at the end
      } else if (isDeleting && text === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
        setTypingSpeed(500) // Pause before next phrase
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed, phrases])

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 reveal">
            <Code2 className="w-3 h-3" />
            <span>Available for new opportunities</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 reveal">
            I&apos;m Tarun, a <span className="text-primary italic">Creative</span> Developer.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 h-24 md:h-12 typing-animation reveal">
            {text}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 reveal">
            <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90" asChild>
              <a href="#projects">
                View My Work
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <div className="flex items-center gap-4">
              <ResumeButton variant="outline" className="border-primary/20 hover:bg-primary/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
