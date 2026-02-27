"use client"

import * as React from "react"
import Link from "next/link"
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  const [year, setYear] = React.useState<number | null>(null)

  React.useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="py-12 border-t border-border/40">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-xl font-bold tracking-tighter text-primary mb-2">
              DevSphere<span className="text-accent">.</span>
            </Link>
            <p className="text-sm text-muted-foreground">© {year || "..."} Tarun. All rights reserved.</p>
          </div>

          <div className="flex gap-4">
            <a 
              href="https://github.com/codebyTarun08" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/Tarun5777949762?t=aZtjB6VmvcjAeFm5gBrAUw" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/tarun-kumar-883625293/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#home" className="hover:text-primary transition-colors">Home</Link>
            <Link href="#about" className="hover:text-primary transition-colors">About</Link>
            <Link href="#projects" className="hover:text-primary transition-colors">Projects</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
