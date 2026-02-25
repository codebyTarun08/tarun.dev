
"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Loader2 } from "lucide-react"
import { ResumeButton } from "./ResumeButton"
import { TypingText } from "./hero/TypingText"
import { TechBadges } from "./hero/TechBadges"

// Dynamic import for Spline to prevent SSR issues and optimize performance
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
    </div>
  ),
})

const phrases = [
  "Building Digital Experiences with Precision.",
  "Fullstack & AI Engineering Specialist.",
  "Turning Complex Ideas into Elegant Code.",
  "Architecting Scalable Web Solutions.",
]

export function Hero() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // A slight delay ensures the layout has settled before Spline attempts to initialize its buffer
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen w-full flex items-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_rgba(109,40,217,0.15),_rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(109,40,217,0.2),_rgba(10,10,10,1))]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-between z-10 pt-20">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl text-center lg:text-left z-30"
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
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            I&apos;m Tarun, a <br />
            <span className="text-primary italic relative">
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
            className="h-24 md:h-12 mb-12"
          >
            <TypingText phrases={phrases} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
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

        {/* Right Content - 3D Scene */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="flex-1 w-full h-[50vh] lg:h-full relative mt-12 lg:mt-0"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            {mounted && (
              <Spline 
                key="spline-hero"
                scene="https://prod.spline.design/6Wq1Q7YGyWf8Z9lz/scene.splinecode" 
                className="w-full h-full pointer-events-auto lg:pointer-events-none xl:pointer-events-auto"
              />
            )}
          </div>
          <TechBadges />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
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
