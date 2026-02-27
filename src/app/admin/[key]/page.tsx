
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ResumeManager } from '@/components/admin/ResumeManager';
import { SkillsManager } from '@/components/admin/SkillsManager';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { LayoutDashboard, FileText, Code, FolderGit2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function AdminPanel() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [activeTab, setActiveTab] = React.useState('resume');
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

  React.useEffect(() => {
    if (params.key !== secret) {
      router.push('/');
    } else {
      setIsAuthorized(true);
      // Automatically sign in anonymously if authorized via secret but not yet in Firebase
      if (!isUserLoading && !user && auth) {
        signInAnonymously(auth).catch(console.error);
      }
    }
  }, [params.key, secret, router, user, isUserLoading, auth]);

  if (!isAuthorized) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'resume':
        return <ResumeManager />;
      case 'skills':
        return <SkillsManager />;
      case 'projects':
        return <ProjectsManager />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <LayoutDashboard className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
            <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
            <p className="text-muted-foreground">Select a section from the sidebar to manage your portfolio.</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 font-semibold">
            {activeTab === 'resume' && <FileText className="w-4 h-4" />}
            {activeTab === 'skills' && <Code className="w-4 h-4" />}
            {activeTab === 'projects' && <FolderGit2 className="w-4 h-4" />}
            <span className="capitalize">{activeTab} Management</span>
            {isUserLoading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
          </div>
        </header>
        <main className="p-6">
          <div className="mx-auto max-w-5xl">
            {renderContent()}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
