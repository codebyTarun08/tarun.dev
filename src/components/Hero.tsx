
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2 } from "lucide-react"

export function Hero() {
  const [text, setText] = React.useState("")
  const fullText = "Building Digital Experiences with Precision."
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index))
        setIndex((prev) => prev + 1)
      }, 70)
      return () => clearTimeout(timeout)
    }
  }, [index])

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
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 h-16 md:h-8 typing-animation reveal">
            {text}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 reveal">
            <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90">
              View My Work
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5">
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
