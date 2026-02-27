
'use client';

import * as React from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ResumeManager() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchResume() {
      if (!firestore) return;
      try {
        const docRef = doc(firestore, 'portfolioConfig', 'resume');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeUrl(docSnap.data().resumeUrl || '');
        }
      } catch (err) {
        console.error('Error fetching resume config:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, [firestore]);

  const handleSave = async () => {
    if (!resumeUrl || !firestore || !user) {
      if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be signed in to update the resume.' });
      }
      return;
    }
    
    setSaving(true);
    const docRef = doc(firestore, 'portfolioConfig', 'resume');
    const data = {
      resumeUrl,
      lastUpdated: serverTimestamp(),
    };

    setDocumentNonBlocking(docRef, data, { merge: true });
    
    // We assume success for the UI since we use optimistic non-blocking pattern
    // The global error listener will catch any permission issues
    setTimeout(() => {
      setSaving(false);
      toast({ title: 'Update Initiated', description: 'The resume URL update has been queued.' });
    }, 500);
  };

  if (loading || isUserLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle>Professional Resume</CardTitle>
        <CardDescription>Manage your global resume link used throughout the portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume-url">Resume PDF URL</Label>
          <div className="flex gap-2">
            <Input 
              id="resume-url" 
              placeholder="https://drive.google.com/..." 
              value={resumeUrl} 
              onChange={(e) => setResumeUrl(e.target.value)} 
            />
            {resumeUrl && (
              <Button variant="outline" size="icon" asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Supports Google Drive sharing links, direct PDF links, or Firebase Storage URLs.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Update Resume Link
        </Button>
      </CardFooter>
    </Card>
  );
}
