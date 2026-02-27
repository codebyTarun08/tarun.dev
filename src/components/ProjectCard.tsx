
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github, Info, Code2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Project = {
  id: number
  name: string
  description: string | null
  topics: string[]
  homepage: string
  html_url: string
  language: string
  readmeMarkdown?: string
  aiSummary?: string
}

interface ProjectCardProps {
  project: Project
  onOpenDetails: (project: Project) => void
}

export function ProjectCard({ project, onOpenDetails }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group relative h-full"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500" />
      
      <div className="relative h-full flex flex-col bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-primary/50">
        
        {/* Card Header with Icon and Actions */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-md">
            <Code2 className="w-6 h-6" />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:bg-primary/20 hover:text-primary transition-all shadow-sm" 
              asChild
            >
              <a href={project.html_url} target="_blank" rel="noopener noreferrer" title="View Source">
                <Github className="w-4 h-4" />
              </a>
            </Button>
            {project.homepage && (
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-9 w-9 rounded-full hover:bg-accent/20 hover:text-accent transition-all shadow-sm" 
                asChild
              >
                <a href={project.homepage} target="_blank" rel="noopener noreferrer" title="Live Demo">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors drop-shadow-sm">
            {project.name.replace(/-/g, ' ')}
          </h3>
          <p className="text-sm font-medium text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
            {project.description || "An innovative digital solution architected with precision and modern design principles."}
          </p>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {project.topics?.length > 0 ? (
                project.topics.slice(0, 3).map((topic) => (
                  <Badge 
                    key={topic} 
                    variant="default" 
                    className="bg-primary/30 text-primary border-primary/40 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 shadow-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {topic}
                  </Badge>
                ))
              ) : (
                <Badge 
                  variant="default" 
                  className="bg-accent/30 text-accent-foreground border-accent/40 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 shadow-sm transition-colors hover:bg-accent/10 hover:text-accent-foreground"
                >
                  {project.language || "Web Project"}
                </Badge>
              )}
            </div>

            <Button 
              onClick={() => onOpenDetails(project)}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 font-bold flex items-center justify-center gap-2 group/btn"
            >
              <Info className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
              Project Insights
            </Button>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="h-1.5 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700" />
      </div>
    </motion.div>
  )
}
