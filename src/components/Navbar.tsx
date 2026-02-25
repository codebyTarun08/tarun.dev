
"use client"

import * as React from "react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { cn } from "@/lib/utils"
import { ResumeButton } from "./ResumeButton"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [active, setActive] = React.useState("Home")
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      const sections = navItems.map(item => item.name.toLowerCase())
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActive(section.charAt(0).toUpperCase() + section.slice(1))
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-3 glass" : "py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
          DevSphere<span className="text-accent">.</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActive(item.name)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                active === item.name ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-border/50 mx-2" />
          <ResumeButton variant="ghost" className="h-9 px-4 text-xs" />
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <ResumeButton variant="outline" className="h-9 px-4 text-[10px]" />
        </div>
      </div>
    </nav>
  )
}
