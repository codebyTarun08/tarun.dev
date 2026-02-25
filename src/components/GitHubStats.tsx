
"use client"

import * as React from "react"
import { Star, Users, FolderCode, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export function GitHubStats() {
  const [data, setData] = React.useState({
    repos: "...",
    stars: "...",
    followers: "...",
    following: "..."
  })

  React.useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch basic profile info
        const profileRes = await fetch("https://api.github.com/users/codebyTarun08")
        const profile = await profileRes.json()

        // Fetch all repos to count stars (GitHub REST API limit is 100 per page)
        const reposRes = await fetch("https://api.github.com/users/codebyTarun08/repos?per_page=100")
        const repos = await reposRes.json()
        
        const totalStars = Array.isArray(repos) 
          ? repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0)
          : 0

        setData({
          repos: profile.public_repos?.toString() || "0",
          stars: totalStars.toString(),
          followers: profile.followers?.toString() || "0",
          following: profile.following?.toString() || "0"
        })
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error)
      }
    }

    fetchGitHubData()
  }, [])

  const stats = [
    { label: "Repos", value: data.repos, icon: FolderCode, color: "text-blue-500" },
    { label: "Stars", value: data.stars, icon: Star, color: "text-yellow-500" },
    { label: "Followers", value: data.followers, icon: Users, color: "text-purple-500" },
    { label: "Following", value: data.following, icon: Activity, color: "text-green-500" },
  ]

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
