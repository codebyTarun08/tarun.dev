
"use client"

import * as React from "react"
import Image from "next/image"
import { FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResumeModal } from "./ResumeModal"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { cn } from "@/lib/utils"

interface ResumeButtonProps {
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function ResumeButton({ variant = "default", className }: ResumeButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const resumeThumb = PlaceHolderImages.find(img => img.id === "resume-thumbnail")

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Preview (Desktop Only) */}
      <div 
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 aspect-[1/1.4] bg-card rounded-xl border border-border shadow-2xl overflow-hidden pointer-events-none z-50 transition-all duration-300 origin-bottom hidden lg:block",
          isHovered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <Image 
          src={resumeThumb?.imageUrl || ""} 
          alt="Resume Preview" 
          fill 
          className="object-cover"
          data-ai-hint="resume thumbnail"
        />
        <div className="absolute bottom-2 left-2 right-2 flex justify-center z-20">
          <div className="bg-primary/90 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded-md uppercase tracking-tighter">
            Preview
          </div>
        </div>
      </div>

      <Button 
        variant={variant}
        size="lg" 
        className={cn("rounded-full px-8 h-12 transition-all duration-300 group", className)}
        onClick={() => setIsOpen(true)}
      >
        <FileText className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
        View Resume
        <ChevronRight className="ml-1 w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
      </Button>

      <ResumeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
