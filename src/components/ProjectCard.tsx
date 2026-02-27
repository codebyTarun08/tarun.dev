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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="group relative h-full"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
      
      <div className="relative h-full flex flex-col bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-primary/10 transition-all duration-500">
        
        {/* Card Header with Icon and Actions */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
            <Code2 className="w-6 h-6" />
          </div>
          <div className="flex gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary transition-colors" 
              asChild
            >
              <a href={project.html_url} target="_blank" rel="noopener noreferrer" title="View Source">
                <Github className="w-4 h-4" />
              </a>
            </Button>
            {project.homepage && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-accent/20 hover:text-accent transition-colors" 
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
          <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
            {project.name.replace(/-/g, ' ')}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
            {project.description || "An innovative digital solution architected with precision and modern design principles."}
          </p>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {project.topics?.length > 0 ? (
                project.topics.slice(0, 3).map((topic) => (
                  <Badge 
                    key={topic} 
                    variant="secondary" 
                    className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                  >
                    {topic}
                  </Badge>
                ))
              ) : (
                <Badge 
                  variant="secondary" 
                  className="bg-accent/5 text-accent border-accent/10 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5"
                >
                  {project.language || "Web Project"}
                </Badge>
              )}
            </div>

            <Button 
              onClick={() => onOpenDetails(project)}
              className="w-full rounded-xl bg-secondary hover:bg-primary hover:text-white border-transparent transition-all duration-300 font-bold flex items-center justify-center gap-2 group/btn"
            >
              <Info className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
              Project Insights
            </Button>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="h-1 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700" />
      </div>
    </motion.div>
  )
}
