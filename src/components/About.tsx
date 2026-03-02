"use client"

import * as React from "react"
import Image from "next/image"
import { GitHubStats } from "./GitHubStats"
import { GraduationCap, School, BookOpen, MapPin, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const educationData = [
  {
    type: "Degree",
    title: "Bachelors of Technology",
    specialization: "Artificial Intelligence and Machine Learning",
    institution: "Galgotias College of Engineering and Technology",
    location: "Greater Noida",
    subtext: "Affiliated with Dr. A.P.J. Abdul Kalam Technical University, Lucknow",
    score: "7.6 CGPA (till 7th Sem)",
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    type: "Intermediate",
    title: "Intermediate",
    institution: "Sumitra Public Inter College",
    location: "Sitapur",
    subtext: "Board of High School and Intermediate Education Uttar Pradesh",
    score: "84.2%",
    icon: School,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    type: "High School",
    title: "High School",
    institution: "Sumitra Public Inter College",
    location: "Sitapur",
    subtext: "Board of High School and Intermediate Education Uttar Pradesh",
    score: "82%",
    icon: BookOpen,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
]

export function About() {
  const profileImageUrl = "https://drive.google.com/uc?id=1F0Fq0HAP00o3e8--9bxEMI-qxzDijqkp"
  const githubFallbackUrl = "https://github.com/codebyTarun08.png"

  const [imgSrc, setImgSrc] = React.useState(profileImageUrl)

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="relative reveal sticky top-24">
            <div className="aspect-square rounded-2xl overflow-hidden relative group border-4 border-white dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <Image 
                src={imgSrc} 
                alt="Tarun Profile" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
                unoptimized 
                onError={() => setImgSrc(githubFallbackUrl)}
                data-ai-hint="developer portrait"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl -z-10 blur-md opacity-50 shadow-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/20 rounded-2xl -z-10 shadow-sm" />
            
            <div className="mt-12 hidden lg:block">
              <GitHubStats />
            </div>
          </div>

          <div className="flex flex-col gap-10 reveal">
            <div>
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4 drop-shadow-sm">About Me</h2>
              <h3 className="text-4xl font-bold mb-6 drop-shadow-sm">Crafting Digital Excellence Through AI & Clean Code.</h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I am a full-stack developer based in Noida, India, passionate about building high-performance web applications that provide exceptional user experiences. With expertise in the modern web ecosystem, I bridge the gap between complex engineering and elegant design.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold tracking-tight">Educational Journey</h4>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {educationData.map((edu, idx) => (
                  <div key={idx} className="group relative pl-8 pb-2 border-l-2 border-muted hover:border-primary/40 transition-colors">
                    <div className={cn(
                      "absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                      edu.bgColor,
                      edu.color
                    )}>
                      <edu.icon className="w-4 h-4" />
                    </div>
                    
                    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm group-hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                        <div>
                          <h5 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{edu.title}</h5>
                          {edu.specialization && (
                            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mt-1">{edu.specialization}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="w-fit h-fit gap-1.5 py-1 px-3 bg-primary/5 text-primary border-primary/10">
                          <Award className="w-3 h-3" />
                          {edu.score}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                          <School className="w-3.5 h-3.5 opacity-60" />
                          {edu.institution}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {edu.location}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-2 mt-2 italic">
                          {edu.subtext}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden">
              <GitHubStats />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}