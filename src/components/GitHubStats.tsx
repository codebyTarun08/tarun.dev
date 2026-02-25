
"use client"

import * as React from "react"
import { GitCommit, Star, Users, FolderCode } from "lucide-react"

const stats = [
  { label: "Repos", value: "45+", icon: FolderCode, color: "text-blue-500" },
  { label: "Stars", value: "120+", icon: Star, color: "text-yellow-500" },
  { label: "Commits", value: "1.2k", icon: GitCommit, color: "text-green-500" },
  { label: "Followers", value: "30+", icon: Users, color: "text-purple-500" },
]

export function GitHubStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 rounded-xl bg-card border border-border flex flex-col items-center justify-center group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
          <stat.icon className={cn("w-6 h-6 mb-2 transition-transform group-hover:scale-110", stat.color)} />
          <span className="text-2xl font-bold">{stat.value}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

import { cn } from "@/lib/utils"
