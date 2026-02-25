
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"

interface Skill {
  name: string
  color?: string
  icon: string
  category: string
}

function MarqueeRow({ skills, direction, speed }: { skills: Skill[], direction: 'left' | 'right', speed: string }) {
  if (skills.length === 0) return null;
  const duplicatedSkills = [...skills, ...skills, ...skills]

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
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300 group cursor-default"
          >
            <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-110 text-primary">
              <div dangerouslySetInnerHTML={{ __html: skill.icon || '<svg viewBox="0 0 24 24" class="w-full h-full fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' }} className="w-full h-full" />
            </div>
            <span className="text-lg font-bold tracking-tight">{skill.name}</span>
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
        const allSkills = querySnapshot.docs.map(doc => doc.data() as Skill);
        
        // Split into 3 rows logically
        const r1 = allSkills.filter((_, i) => i % 3 === 0);
        const r2 = allSkills.filter((_, i) => i % 3 === 1);
        const r3 = allSkills.filter((_, i) => i % 3 === 2);
        
        setSkillsByRow({ r1, r2, r3 });
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) return null;

  return (
    <section id="skills" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-16 reveal">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4 text-center">Skills</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-center mb-6">Expertise in Modern Tech.</h3>
        <p className="max-w-2xl mx-auto text-muted-foreground text-center text-lg">
          I leverage a cutting-edge tech stack to build scalable, high-performance applications with exceptional user experiences.
        </p>
      </div>

      <div className="space-y-6">
        <MarqueeRow skills={skillsByRow.r1} direction="right" speed="35s" />
        <MarqueeRow skills={skillsByRow.r2} direction="left" speed="40s" />
        <MarqueeRow skills={skillsByRow.r3} direction="right" speed="30s" />
      </div>
    </section>
  )
}
