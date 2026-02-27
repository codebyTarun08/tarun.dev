
'use client';

import * as React from 'react';
import { useFirestore, useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Save, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ResumeManager() {
  const firestore = useFirestore();
  const auth = useAuth();
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

  const handleSave = () => {
    if (!resumeUrl || !firestore) return;
    
    if (!user) {
      toast({ 
        variant: 'destructive', 
        title: 'Unauthorized', 
        description: 'Initializing session... Please try again in a moment.' 
      });
      if (auth) initiateAnonymousSignIn(auth);
      return;
    }
    
    setSaving(true);
    const docRef = doc(firestore, 'portfolioConfig', 'resume');
    const data = {
      resumeUrl,
      lastUpdated: serverTimestamp(),
    };

    // Use the standardized non-blocking pattern.
    // This will trigger the global JSON error overlay if permission is denied.
    setDocumentNonBlocking(docRef, data, { merge: true });
    
    setTimeout(() => {
      setSaving(false);
      toast({ title: 'Success', description: 'Resume update request has been sent.' });
    }, 800);
  };

  const handleAdminSignIn = () => {
    if (auth) {
      initiateAnonymousSignIn(auth);
    }
  };

  if (loading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse text-muted-foreground">Synchronizing Admin Config...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Auth Status Banner */}
      {!user ? (
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Administrative Session Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4 mt-2">
            <span>Your session is not currently connected to the portfolio backend.</span>
            <Button size="sm" variant="destructive" onClick={handleAdminSignIn} className="h-8">
              Initialize Session
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-green-500/5 border-green-500/20 text-green-600 dark:text-green-400">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Admin Session Active</AlertTitle>
          <AlertDescription className="text-xs opacity-80">
            Authenticated as: <span className="font-mono">{user.uid}</span>
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-2xl border-primary/10 overflow-hidden">
        <div className="h-1.5 w-full bg-primary/20">
          <div className="h-full bg-primary w-1/3" />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight">Professional Resume</CardTitle>
          <CardDescription>
            Update your professional CV link. This will update the "View Resume" buttons globally across the portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="resume-url" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Google Drive / PDF URL
            </Label>
            <div className="flex gap-3">
              <Input 
                id="resume-url" 
                placeholder="https://drive.google.com/file/d/..." 
                value={resumeUrl} 
                onChange={(e) => setResumeUrl(e.target.value)} 
                className="rounded-xl bg-secondary/30 border-transparent focus:border-primary transition-all shadow-inner h-12"
              />
              {resumeUrl && (
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl" asChild>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground bg-muted p-2 rounded-lg italic border border-border/50">
              Note: Google Drive links will be automatically transformed into embeddable previews in the modal.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex justify-end gap-3">
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
