
"use client"

import * as React from "react"
import { ExternalLink, Github, BookOpen, Layers } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Project } from "./ProjectCard"

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-none rounded-2xl bg-card overflow-hidden">
        <div className="relative h-48 bg-primary/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute bottom-6 left-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <BookOpen className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">About Project</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description || "A comprehensive project showcasing advanced software architecture and efficient user interface design."}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Layers className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Technologies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.topics?.map((topic) => (
                    <Badge key={topic} variant="secondary" className="px-3 py-1 rounded-md text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {!project.topics?.length && project.language && (
                    <Badge variant="secondary" className="px-3 py-1 rounded-md text-xs">
                      {project.language}
                    </Badge>
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
                <div className="flex flex-col gap-3">
                  {project.homepage && (
                    <Button variant="default" className="w-full justify-start rounded-lg" asChild>
                      <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Preview
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full justify-start rounded-lg" asChild>
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Repository
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
