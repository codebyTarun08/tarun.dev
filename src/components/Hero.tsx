
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2 } from "lucide-react"
import { ResumeButton } from "./ResumeButton"
import { TypingText } from "./hero/TypingText"

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

  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_rgba(109,40,217,0.15),_rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(109,40,217,0.2),_rgba(10,10,10,1))]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 z-10 pt-32 pb-32 flex flex-col items-center text-center">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white dark:border-white/10 shadow-2xl relative">
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
          <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl -z-10 animate-pulse" />
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">Available for new opportunities</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] md:leading-[0.9]"
          >
            I&apos;m Tarun, a <br />
            <span className="text-primary italic relative inline-block">
              Creative
              <motion.svg
                viewBox="0 0 200 20"
                className="absolute -bottom-2 left-0 w-full h-4 text-accent/50"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <path d="M0 10 Q 50 20 100 10 T 200 10" fill="none" stroke="currentColor" strokeWidth="4" />
              </motion.svg>
            </span> <br />
            Developer.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="h-20 md:h-12 mb-12"
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
              className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all group" 
              asChild
            >
              <a href="#projects">
                View My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <div className="flex items-center gap-4">
              <ResumeButton variant="outline" className="border-primary/30 h-14 px-10 rounded-full hover:bg-primary/5 hover:scale-105 transition-all" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-primary/30 flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
