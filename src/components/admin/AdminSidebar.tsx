
'use client';

import * as React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarFooter
} from '@/components/ui/sidebar';
import { FileText, Code, FolderGit2, LogOut } from 'lucide-react';
import Link from 'next/link';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">A</div>
          <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">Portfolio Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'resume'} 
                  onClick={() => setActiveTab('resume')}
                  tooltip="Resume"
                >
                  <FileText />
                  <span>Resume</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'skills'} 
                  onClick={() => setActiveTab('skills')}
                  tooltip="Skills"
                >
                  <Code />
                  <span>Skills</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'projects'} 
                  onClick={() => setActiveTab('projects')}
                  tooltip="Projects"
                >
                  <FolderGit2 />
                  <span>Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors group-data-[collapsible=icon]:justify-center">
          <LogOut className="w-4 h-4" />
          <span className="group-data-[collapsible=icon]:hidden">Back to Website</span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
