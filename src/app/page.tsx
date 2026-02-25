
"use client"

import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Projects } from "@/components/Projects"
import { ContactSection } from "@/components/ContactSection"
import { Footer } from "@/components/Footer"
import { useReveal } from "@/hooks/use-reveal"

export default function Home() {
  useReveal()

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <ContactSection />
      <Footer />
    </main>
  )
}
