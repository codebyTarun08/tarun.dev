
"use client"

import { useEffect } from "react"

export function useReveal() {
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal")
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight
        const revealTop = reveals[i].getBoundingClientRect().top
        const revealPoint = 150
        if (revealTop < windowHeight - revealPoint) {
          reveals[i].classList.add("active")
        }
      }
    }

    window.addEventListener("scroll", reveal)
    reveal() // Initial check
    return () => window.removeEventListener("scroll", reveal)
  }, [])
}
