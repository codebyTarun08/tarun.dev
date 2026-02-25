
"use client"

import * as React from "react"
import { ExternalLink, Github, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export type Project = {
  id: number
  name: string
  description: string
  topics: string[]
  homepage: string
  html_url: string
  language: string
}

interface ProjectCardProps {
  project: Project
  onOpenDetails: (project: Project) => void
}

export function ProjectCard({ project, onOpenDetails }: ProjectCardProps) {
  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 reveal">
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Github className="w-6 h-6" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
              </a>
            </Button>
            {project.homepage && (
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-grow">
          {project.description || "A comprehensive project showcasing advanced software architecture and efficient user interface design."}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.topics?.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">
              {topic}
            </Badge>
          )) || <Badge variant="secondary">{project.language}</Badge>}
        </div>

        <Button 
          onClick={() => onOpenDetails(project)}
          variant="outline" 
          className="w-full rounded-xl border-primary/20 hover:bg-primary hover:text-white group-hover:border-primary transition-all"
        >
          <Info className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  )
}
