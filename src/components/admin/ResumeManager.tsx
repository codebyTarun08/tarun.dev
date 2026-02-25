
'use client';

import * as React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ResumeManager() {
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchResume() {
      try {
        const docRef = doc(db, 'portfolioConfig', 'resume');
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
  }, []);

  const handleSave = async () => {
    if (!resumeUrl) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'portfolioConfig', 'resume'), {
        resumeUrl,
        lastUpdated: serverTimestamp(),
      });
      toast({ title: 'Success', description: 'Resume URL updated successfully.' });
    } catch (err) {
      console.error('Error saving resume:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update resume URL.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

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
              placeholder="https://example.com/resume.pdf" 
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
          <p className="text-xs text-muted-foreground">Ensure this is a public link to your professional resume (e.g., from Firebase Storage or Google Drive).</p>
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
