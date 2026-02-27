
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2 } from "lucide-react"
import { ResumeButton } from "./ResumeButton"
import { TypingText } from "./hero/TypingText"
import { AnimatedBackground } from "./hero/AnimatedBackground"

const phrases = [
  "Building Digital Experiences with Precision.",
  "Fullstack & AI Engineering Specialist.",
  "Turning Complex Ideas into Elegant Code.",
  "Architecting Scalable Web Solutions.",
]

export function Hero() {
  const profileImageUrl = "https://drive.google.com/uc?id=1F0Fq0HAP00o3e8--9bxEMI-qxzDijqkp"
  const githubFallbackUrl = "https://github.com/codebyTarun08.png"
  const [imgSrc, setImgSrc] = React.useState(profileImageUrl)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center bg-background" />
  )

  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* React Bits Inspired Background */}
      <AnimatedBackground />

      <div className="container mx-auto px-6 z-10 pt-32 pb-32 flex flex-col items-center text-center">
        {/* Profile Image with Enhanced Shadows and Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-10"
        >
          <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative bg-card transition-transform hover:scale-105 duration-500 z-10">
            <Image
              src={imgSrc}
              alt="Tarun Profile"
              fill
              className="object-cover"
              priority
              unoptimized
              onError={() => setImgSrc(githubFallbackUrl)}
              data-ai-hint="developer portrait"
            />
          </div>
          {/* Pulsing Outer Glow */}
          <div className="absolute -inset-6 bg-primary/25 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur-xl -z-10 opacity-50" />
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Glass Badge with Shadow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 backdrop-blur-md text-primary text-[10px] font-bold mb-8 border border-primary/20 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
          >
            <Code2 className="w-3 h-3" />
            <span className="uppercase tracking-widest">Available for new opportunities</span>
          </motion.div>
          
          {/* Bold Heading with Strong Drop Shadow */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1] md:leading-[0.95] max-w-5xl mx-auto drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          >
            I&apos;m Tarun, a <br className="hidden md:block" />
            <span className="text-primary italic relative inline-block">
              Creative
              <motion.svg
                viewBox="0 0 200 20"
                className="absolute -bottom-2 left-0 w-full h-4 text-accent/50 drop-shadow-md"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <path d="M0 10 Q 50 20 100 10 T 200 10" fill="none" stroke="currentColor" strokeWidth="4" />
              </motion.svg>
            </span> Developer.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="h-20 md:h-12 mb-12 drop-shadow-sm"
          >
            <TypingText phrases={phrases} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center"
          >
            <Button 
              size="lg" 
              className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-[0_10px_30px_rgba(109,40,217,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_40px_rgba(109,40,217,0.5)] hover:scale-105 transition-all group" 
              asChild
            >
              <a href="#projects">
                View My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <div className="flex items-center gap-4">
              <ResumeButton variant="outline" className="border-primary/30 h-14 px-10 rounded-full hover:bg-primary/5 hover:scale-105 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator with Drop Shadow */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 drop-shadow-lg"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-primary/30 flex justify-center pt-2 shadow-inner"
        >
          <div className="w-1 h-2 bg-primary rounded-full shadow-sm" />
        </motion.div>
      </motion.div>
    </section>
  )
}
