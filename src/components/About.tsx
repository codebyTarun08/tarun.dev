
"use client"

import * as React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { GitHubStats } from "./GitHubStats"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const skills = [
  "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", 
  "Firebase", "PostgreSQL", "Docker", "UI/UX Design", "GraphQL"
]

export function About() {
  const profileImg = PlaceHolderImages.find(img => img.id === "about-profile")

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative reveal">
            <div className="aspect-square rounded-2xl overflow-hidden relative group">
              <Image 
                src={profileImg?.imageUrl || ""} 
                alt="Profile image" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                data-ai-hint="developer profile"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/20 rounded-2xl -z-10" />
          </div>

          <div className="flex flex-col gap-8 reveal">
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">About Me</h2>
              <h3 className="text-4xl font-bold mb-6">Crafting Digital Excellence Through Clean Code.</h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I am a full-stack developer based in India, passionate about building high-performance web applications that provide exceptional user experiences. With expertise in the modern web ecosystem, I bridge the gap between complex engineering and elegant design.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">My Stack</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-background hover:bg-primary hover:text-white transition-colors cursor-default">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <GitHubStats />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
