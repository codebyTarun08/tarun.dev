
'use client';

import * as React from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDocs, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, ChevronLeft, ChevronRight, Plus, Trash2, Cpu, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export interface TechItem {
  name: string;
  iconUrl?: string;
  bgColor?: string;
  borderColor?: string;
}

interface Repo {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
}

interface Override {
  id: string;
  featured?: boolean;
  visible?: boolean;
  customOrder?: number;
  customDescription?: string;
  techStack?: TechItem[];
}

export function ProjectsManager() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [overrides, setOverrides] = React.useState<Record<string, Override>>({});
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [techEditingRepo, setTechEditingRepo] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  const reposPerPage = 6;

  const fetchData = React.useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const repoRes = await fetch("https://api.github.com/users/codebyTarun08/repos?sort=updated&per_page=100");
      const repoData = await repoRes.json();
      
      const overrideSnapshot = await getDocs(collection(firestore, 'projectOverrides'));
      const overrideData: Record<string, Override> = {};
      overrideSnapshot.forEach(doc => {
        overrideData[doc.id] = { id: doc.id, ...doc.data() } as Override;
      });

      setRepos(repoData);
      setOverrides(overrideData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [firestore]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateOverride = (repoName: string, field: keyof Override, value: any) => {
    setOverrides(prev => ({
      ...prev,
      [repoName]: {
        ...(prev[repoName] || { id: repoName, visible: true, featured: false, techStack: [] }),
        [field]: value
      }
    }));
  };

  const handleSaveOverride = async (repoName: string) => {
    if (!firestore || !user) return;
    setSavingId(repoName);
    
    const data = overrides[repoName] || { visible: true, featured: false };
    const { id, ...saveData } = data;
    const docRef = doc(firestore, 'projectOverrides', repoName);
    
    setDocumentNonBlocking(docRef, saveData, { merge: true });
    
    setTimeout(() => {
      setSavingId(null);
      toast({ title: 'Success', description: `Overrides for ${repoName} updated.` });
    }, 500);
  };

  const handleAddTech = (repoName: string) => {
    const currentStack = overrides[repoName]?.techStack || [];
    handleUpdateOverride(repoName, 'techStack', [
      ...currentStack,
      { name: '', iconUrl: '', bgColor: '#6d28d9', borderColor: '#4c1d95' }
    ]);
  };

  const handleRemoveTech = (repoName: string, index: number) => {
    const currentStack = [...(overrides[repoName]?.techStack || [])];
    currentStack.splice(index, 1);
    handleUpdateOverride(repoName, 'techStack', currentStack);
  };

  const handleUpdateTech = (repoName: string, index: number, field: keyof TechItem, value: string) => {
    const currentStack = [...(overrides[repoName]?.techStack || [])];
    currentStack[index] = { ...currentStack[index], [field]: value };
    handleUpdateOverride(repoName, 'techStack', currentStack);
  };

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(repos.length / reposPerPage);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Project Overrides</CardTitle>
          <CardDescription>Curate which GitHub repositories are visible and featured on your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Tech Stack</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRepos.map((repo) => {
                  const override = overrides[repo.name] || { visible: true, featured: false, techStack: [] };
                  return (
                    <TableRow key={repo.name}>
                      <TableCell>
                        <div className="font-semibold">{repo.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{repo.html_url}</div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={override.featured} 
                          onCheckedChange={(val) => handleUpdateOverride(repo.name, 'featured', val)} 
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={override.visible !== false} 
                          onCheckedChange={(val) => handleUpdateOverride(repo.name, 'visible', val)} 
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 rounded-full"
                          onClick={() => setTechEditingRepo(repo.name)}
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          {override.techStack?.length || 0} Technologies
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => handleSaveOverride(repo.name)}
                          disabled={savingId === repo.name}
                        >
                          {savingId === repo.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-4">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack Management Dialog */}
      <Dialog open={!!techEditingRepo} onOpenChange={(open) => !open && setTechEditingRepo(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Tech Stack: {techEditingRepo}</DialogTitle>
            <DialogDescription>Define the specific technologies and their visual style for this project.</DialogDescription>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto p-6 pt-2 space-y-4">
            {techEditingRepo && (overrides[techEditingRepo]?.techStack || []).map((tech, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-secondary/20 border border-border/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-1 lg:col-span-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tech Name</Label>
                  <Input 
                    placeholder="React" 
                    value={tech.name} 
                    onChange={(e) => handleUpdateTech(techEditingRepo, idx, 'name', e.target.value)}
                    className="h-9 text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1 lg:col-span-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon Link</Label>
                  <Input 
                    placeholder="https://..." 
                    value={tech.iconUrl || ''} 
                    onChange={(e) => handleUpdateTech(techEditingRepo, idx, 'iconUrl', e.target.value)}
                    className="h-9 text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Background</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="color" 
                      value={tech.bgColor || '#6d28d9'} 
                      onChange={(e) => handleUpdateTech(techEditingRepo, idx, 'bgColor', e.target.value)}
                      className="h-9 w-12 p-1 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-mono">{tech.bgColor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Border</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="color" 
                      value={tech.borderColor || '#4c1d95'} 
                      onChange={(e) => handleUpdateTech(techEditingRepo, idx, 'borderColor', e.target.value)}
                      className="h-9 w-12 p-1 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] font-mono">{tech.borderColor}</span>
                  </div>
                </div>
                <div className="flex justify-end lg:col-span-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive h-9 w-9"
                    onClick={() => handleRemoveTech(techEditingRepo, idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {techEditingRepo && (overrides[techEditingRepo]?.techStack || []).length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                <Cpu className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No custom technologies defined for this project.</p>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 border-t bg-muted/30 gap-2">
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => techEditingRepo && handleAddTech(techEditingRepo)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Technology
            </Button>
            <Button 
              className="rounded-full"
              onClick={() => {
                if (techEditingRepo) handleSaveOverride(techEditingRepo);
                setTechEditingRepo(null);
              }}
            >
              Save & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
