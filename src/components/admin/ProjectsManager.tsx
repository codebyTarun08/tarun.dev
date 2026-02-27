
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
import { Loader2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

export function ProjectsManager() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [overrides, setOverrides] = React.useState<Record<string, Override>>({});
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  const reposPerPage = 6;

  const fetchData = React.useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      // Fetch GitHub repos
      const repoRes = await fetch("https://api.github.com/users/codebyTarun08/repos?sort=updated&per_page=100");
      const repoData = await repoRes.json();
      
      // Fetch Overrides from Firestore
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
        ...(prev[repoName] || { id: repoName, visible: true, featured: false }),
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

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(repos.length / reposPerPage);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
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
                <TableHead>Custom Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRepos.map((repo) => {
                const override = overrides[repo.name] || { visible: true, featured: false };
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
                      <Textarea 
                        placeholder="Override description..."
                        className="min-h-[60px] text-xs resize-none"
                        value={override.customDescription || ''}
                        onChange={(e) => handleUpdateOverride(repo.name, 'customDescription', e.target.value)}
                      />
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
  );
}
