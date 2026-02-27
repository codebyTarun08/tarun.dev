
'use client';

import * as React from 'react';
import { ExternalLink, Github, BookOpen, Layers, Sparkles, Loader2, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Project } from './ProjectCard';
import { summarizeProjectReadme } from '@/ai/flows/ai-project-readme-summary-flow';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [readme, setReadme] = React.useState<string | null>(null);
  const [aiSummary, setAiSummary] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [aiLoading, setAiLoading] = React.useState(false);

  React.useEffect(() => {
    if (!project || !isOpen) {
      setReadme(null);
      setAiSummary(null);
      return;
    }

    const fetchReadmeAndSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.github.com/repos/codebyTarun08/${project.name}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        });
        
        if (response.ok) {
          const content = await response.text();
          setReadme(content);
          setLoading(false);

          setAiLoading(true);
          try {
            const summaryResult = await summarizeProjectReadme({ readmeContent: content });
            setAiSummary(summaryResult.summary);
          } catch (aiErr) {
            console.warn("AI Summary synthesis skipped or failed", aiErr);
            setAiSummary(null);
          } finally {
            setAiLoading(false);
          }
        } else {
          // README not found - this is a valid state for some repos
          setReadme(null);
          setAiSummary(null);
        }
      } catch (err) {
        console.warn("Failed to synchronize with GitHub root manifest", err);
        setReadme(null);
      } finally {
        setLoading(false);
        setAiLoading(false);
      }
    };

    fetchReadmeAndSummary();
  }, [project, isOpen]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 border-none bg-background rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <DialogTitle className="sr-only">Project details for {project.name}</DialogTitle>
        
        <div className="relative h-64 bg-primary/10 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-grow">
              <h2 className="text-4xl font-black tracking-tighter text-foreground drop-shadow-sm mb-4">
                {project.name.replace(/-/g, ' ')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {/* Custom Tech Stack First */}
                {(project.techStack || []).map((tech, idx) => {
                  const isObject = typeof tech === 'object';
                  const name = isObject ? tech.name : tech;
                  return (
                    <Badge 
                      key={`${name}-${idx}`} 
                      variant="outline" 
                      className={cn(
                        "uppercase text-[10px] font-bold px-3 py-1.5 flex items-center gap-2 transition-all hover:scale-105",
                        !isObject && "bg-primary/5 border-primary/20 text-primary"
                      )}
                      style={isObject ? {
                        backgroundColor: `${tech.bgColor}1A`, // 10% opacity
                        color: tech.bgColor,
                        borderColor: tech.borderColor
                      } : {}}
                    >
                      {isObject && tech.iconUrl && (
                        <img src={tech.iconUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                      )}
                      {name}
                    </Badge>
                  );
                })}
                
                {/* Fallback Topics (if they don't overlap with techStack) */}
                {project.topics?.filter(t => 
                  !(project.techStack || []).some(existing => 
                    typeof existing === 'string' ? existing === t : existing.name === t
                  )
                ).map(topic => (
                  <Badge key={topic} variant="secondary" className="bg-secondary/50 text-secondary-foreground uppercase text-[10px] font-bold px-3 py-1.5 transition-all hover:scale-105">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 h-12 px-6 font-bold" asChild>
                <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  Codebase
                </a>
              </Button>
              {project.homepage && (
                <Button size="lg" className="rounded-full gap-2 bg-primary shadow-lg shadow-primary/20 h-12 px-6 font-bold" asChild>
                  <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                    Live Preview
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-hidden flex flex-col">
          <ScrollArea className="flex-grow">
            <div className="p-8 space-y-10">
              
              <section className="relative p-8 rounded-3xl bg-primary/5 border border-primary/10 overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-16 h-16 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">AI Executive Insights</h3>
                </div>
                {aiLoading ? (
                  <div className="flex items-center gap-4 text-muted-foreground py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-base font-medium animate-pulse italic">Synthesizing architectural overview...</span>
                  </div>
                ) : (
                  <p className="text-xl font-medium leading-relaxed text-foreground drop-shadow-sm">
                    {aiSummary || project.description || "Compiling project context..."}
                  </p>
                )}
              </section>

              <Separator className="opacity-50" />

              <section className="space-y-8">
                <div className="flex items-center gap-3 text-primary">
                  <FileText className="w-5 h-5" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">Detailed Documentation</h3>
                </div>
                
                {loading ? (
                  <div className="py-24 flex flex-col items-center justify-center gap-6 text-muted-foreground">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-sm font-bold uppercase tracking-widest animate-pulse">Synchronizing with GitHub root...</p>
                  </div>
                ) : readme ? (
                  <div className="prose prose-neutral dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
                    prose-strong:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-muted prose-pre:rounded-2xl prose-pre:p-6 prose-pre:border prose-pre:border-border
                    prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-2xl prose-img:shadow-2xl prose-img:mx-auto
                    prose-hr:border-border
                  ">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      rehypePlugins={[rehypeRaw]}
                    >
                      {readme}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="py-20 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border group hover:border-primary/50 transition-colors">
                    <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                    <p className="text-muted-foreground text-lg font-medium">Repository root manifest not found.</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">The README.md file could not be synchronized from the GitHub repository.</p>
                  </div>
                )}
              </section>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
