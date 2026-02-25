
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"

interface Skill {
  name: string
  icon: string
  category: string
  color?: string
}

const DEFAULT_SKILLS: Skill[] = [
  { name: "React", category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "TypeScript", category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Tailwind", category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Node.js", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Firebase", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Python", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "GitHub", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Docker", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Figma", category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "PostgreSQL", category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Redux", category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
];

function MarqueeRow({ skills, direction, speed }: { skills: Skill[], direction: 'left' | 'right', speed: string }) {
  if (skills.length === 0) return null;
  
  // Multiply skills to ensure enough coverage for a smooth loop
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills]

  return (
    <div className="relative flex overflow-hidden py-4 select-none">
      <div 
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-12",
          direction === 'left' ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{ animationDuration: speed }}
      >
        {duplicatedSkills.map((skill, idx) => (
          <div 
            key={`${skill.name}-${idx}`} 
            className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default"
          >
            <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
              {/* Support both SVG paths and Image URLs */}
              {skill.icon.startsWith('<svg') ? (
                <div dangerouslySetInnerHTML={{ __html: skill.icon }} className="w-full h-full text-primary fill-current" />
              ) : (
                <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
              )}
            </div>
            <span className="text-xl font-bold tracking-tight">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const [skillsByRow, setSkillsByRow] = React.useState<{ r1: Skill[], r2: Skill[], r3: Skill[] }>({ r1: [], r2: [], r3: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSkills() {
      try {
        const q = query(collection(db, 'skills'), where('visible', '==', true), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetchedSkills = querySnapshot.docs.map(doc => doc.data() as Skill);
        
        const allSkills = fetchedSkills.length > 0 ? fetchedSkills : DEFAULT_SKILLS;
        
        // Split into 3 rows logically
        const r1 = allSkills.filter((_, i) => i % 3 === 0);
        const r2 = allSkills.filter((_, i) => i % 3 === 1);
        const r3 = allSkills.filter((_, i) => i % 3 === 2);
        
        setSkillsByRow({ r1, r2, r3 });
      } catch (err) {
        console.error('Error fetching skills:', err);
        setSkillsByRow({
          r1: DEFAULT_SKILLS.filter((_, i) => i % 3 === 0),
          r2: DEFAULT_SKILLS.filter((_, i) => i % 3 === 1),
          r3: DEFAULT_SKILLS.filter((_, i) => i % 3 === 2),
        });
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-16 reveal">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4 text-center">Skills</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-center mb-6">Expertise in Modern Tech.</h3>
        <p className="max-w-2xl mx-auto text-muted-foreground text-center text-lg">
          I leverage a cutting-edge tech stack to build scalable, high-performance applications with exceptional user experiences.
        </p>
      </div>

      <div className="space-y-8">
        {!loading || skillsByRow.r1.length > 0 ? (
          <>
            <MarqueeRow skills={skillsByRow.r1} direction="right" speed="40s" />
            <MarqueeRow skills={skillsByRow.r2} direction="left" speed="50s" />
            <MarqueeRow skills={skillsByRow.r3} direction="right" speed="45s" />
          </>
        ) : (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </section>
  )
}
