
"use client"

import * as React from "react"
import { ExternalLink, Github, BookOpen, Layers, Sparkles, Loader2, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Project } from "./ProjectCard"
import { summarizeProjectReadme } from "@/ai/flows/ai-project-readme-summary-flow"

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [readme, setReadme] = React.useState<string | null>(null)
  const [aiSummary, setAiSummary] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [aiLoading, setAiLoading] = React.useState(false)

  React.useEffect(() => {
    if (!project || !isOpen) {
      setReadme(null)
      setAiSummary(null)
      return
    }

    const fetchReadmeAndSummary = async () => {
      setLoading(true)
      try {
        // Fetch RAW README from GitHub
        const response = await fetch(`https://api.github.com/repos/codebyTarun08/${project.name}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        })
        
        if (!response.ok) throw new Error("README not found")
        
        const content = await response.text()
        setReadme(content)
        setLoading(false)

        // Generate AI Summary
        setAiLoading(true)
        const summaryResult = await summarizeProjectReadme({ readmeContent: content })
        setAiSummary(summaryResult.summary)
      } catch (err) {
        console.error("Failed to fetch README or summary", err)
        setReadme(null)
      } finally {
        setLoading(false)
        setAiLoading(false)
      }
    }

    fetchReadmeAndSummary()
  }, [project, isOpen])

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 border-none bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <DialogTitle className="sr-only">Project details for {project.name}</DialogTitle>
        
        {/* Header Section */}
        <div className="relative h-48 bg-primary/10 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tighter text-foreground drop-shadow-sm">
                {project.name.replace(/-/g, ' ')}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.language && (
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary uppercase text-[10px] font-bold">
                    {project.language}
                  </Badge>
                )}
                {project.topics?.slice(0, 5).map(topic => (
                  <Badge key={topic} variant="secondary" className="bg-secondary/50 text-secondary-foreground uppercase text-[10px] font-bold">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5" asChild>
                <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  Code
                </a>
              </Button>
              {project.homepage && (
                <Button size="sm" className="rounded-full gap-2 bg-primary shadow-lg shadow-primary/20" asChild>
                  <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-hidden flex flex-col">
          <ScrollArea className="flex-grow">
            <div className="p-8 space-y-10">
              
              {/* AI Summary Section */}
              <section className="relative p-6 rounded-2xl bg-primary/5 border border-primary/10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">AI Executive Summary</h3>
                </div>
                {aiLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium animate-pulse italic">Synthesizing project overview...</span>
                  </div>
                ) : (
                  <p className="text-lg font-medium leading-relaxed text-foreground drop-shadow-sm">
                    {aiSummary || project.description || "Synthesizing project context..."}
                  </p>
                )}
              </section>

              <Separator className="opacity-50" />

              {/* Readme Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">Repository Documentation</h3>
                </div>
                
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Fetching Documentation...</p>
                  </div>
                ) : readme ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-base
                    prose-strong:text-foreground prose-code:bg-secondary prose-code:p-1 prose-code:rounded
                    prose-pre:bg-secondary prose-pre:rounded-xl prose-pre:p-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {readme}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-12 text-center bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
                    <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Detailed documentation not found in repository root.</p>
                  </div>
                )}
              </section>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
