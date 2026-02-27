"use client"

import * as React from "react"
import Image from "next/image"
import { GitHubStats } from "./GitHubStats"

export function About() {
  // Using the direct download link format for the Google Drive image
  const profileImageUrl = "https://drive.google.com/uc?id=1F0Fq0HAP00o3e8--9bxEMI-qxzDijqkp"
  const githubFallbackUrl = "https://github.com/codebyTarun08.png"

  const [imgSrc, setImgSrc] = React.useState(profileImageUrl)

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative reveal">
            <div className="aspect-square rounded-2xl overflow-hidden relative group border-4 border-white dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <Image 
                src={imgSrc} 
                alt="Tarun Profile" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
                unoptimized // Bypasses Next.js image proxy to avoid issues with Google Drive redirects
                onError={() => setImgSrc(githubFallbackUrl)}
                data-ai-hint="developer portrait"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl -z-10 blur-md opacity-50 shadow-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/20 rounded-2xl -z-10 shadow-sm" />
          </div>

          <div className="flex flex-col gap-8 reveal">
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4 drop-shadow-sm">About Me</h2>
              <h3 className="text-4xl font-bold mb-6 drop-shadow-sm">Crafting Digital Excellence Through Clean Code.</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I am a full-stack developer based in Noida, India, passionate about building high-performance web applications that provide exceptional user experiences. With expertise in the modern web ecosystem, I bridge the gap between complex engineering and elegant design.
              </p>
            </div>

            <div className="pt-4 drop-shadow-md">
              <GitHubStats />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
