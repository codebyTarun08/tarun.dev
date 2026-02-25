
"use client"

import * as React from "react"
import { X, ExternalLink, Github, Loader2, BookOpen, Layers } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Project } from "./ProjectCard"
import { summarizeProjectReadme } from "@/ai/flows/ai-project-readme-summary-flow"

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [summary, setSummary] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (project && isOpen) {
      fetchReadme(project.name)
    } else {
      setSummary(null)
    }
  }, [project, isOpen])

  const fetchReadme = async (repoName: string) => {
    setIsLoading(true)
    try {
      // For demonstration, fetching actual README from GitHub
      const res = await fetch(`https://raw.githubusercontent.com/codebyTarun08/${repoName}/main/README.md`)
      if (!res.ok) throw new Error("Could not find README")
      const text = await res.text()
      
      const aiResponse = await summarizeProjectReadme({ readmeContent: text })
      setSummary(aiResponse.summary)
    } catch (error) {
      console.error(error)
      setSummary("Unable to generate AI summary at this time.")
    } finally {
      setIsLoading(false)
    }
  }

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
                  <h3 className="text-sm font-bold uppercase tracking-widest">AI Project Summary</h3>
                </div>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground italic">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating AI insights...</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {summary || "No summary available."}
                  </p>
                )}
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
                  {!project.topics?.length && <Badge variant="secondary">{project.language}</Badge>}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
                <div className="flex flex-col gap-3">
                  <Button variant="default" className="w-full justify-start rounded-lg" asChild>
                    <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Preview
                    </a>
                  </Button>
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
