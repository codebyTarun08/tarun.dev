
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { ProjectCard, Project } from "./ProjectCard"
import { ProjectModal } from "./ProjectModal"
import { Button } from "@/components/ui/button"

export function Projects() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  
  const projectsPerPage = 6

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://api.github.com/users/codebyTarun08/repos?sort=updated&per_page=100")
        const data = await response.json()
        
        // Filter projects that have a valid live URL (homepage field)
        const filtered = data.filter((repo: any) => repo.homepage && repo.homepage.trim() !== "")
        setProjects(filtered)
      } catch (error) {
        console.error("Failed to fetch projects", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject)
  const totalPages = Math.ceil(projects.length / projectsPerPage)

  const handleOpenDetails = (project: Project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 reveal">
          <div>
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Portfolio</h2>
            <h3 className="text-4xl font-bold">Featured Projects</h3>
          </div>
          <p className="max-w-md text-muted-foreground text-right hidden md:block">
            A selection of my recent works fetched directly from GitHub, showcasing real-world applications with live demos.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Syncing with GitHub API...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpenDetails={handleOpenDetails} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 gap-6 reveal">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 border-primary/20 hover:border-primary transition-colors"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <span className="text-sm font-medium tracking-widest uppercase">
                  Page {currentPage} <span className="text-muted-foreground">of</span> {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 border-primary/20 hover:border-primary transition-colors"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </section>
  )
}
