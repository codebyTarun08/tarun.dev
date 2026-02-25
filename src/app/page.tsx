
"use client"

import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Skills } from "@/components/Skills"
import { Projects } from "@/components/Projects"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { useReveal } from "@/hooks/use-reveal"

export default function Home() {
  useReveal()

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20" suppressHydrationWarning>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ContactSection />
      <Footer />
    </main>
  )
}
