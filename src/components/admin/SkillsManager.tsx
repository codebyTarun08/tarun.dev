'use client';

import * as React from 'react';
import { useFirestore } from '@/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  order: number;
  visible: boolean;
}

export function SkillsManager() {
  const firestore = useFirestore();
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentSkill, setCurrentSkill] = React.useState<Partial<Skill> | null>(null);
  const { toast } = useToast();

  const fetchSkills = React.useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const q = query(collection(firestore, 'skills'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedSkills = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
      setSkills(fetchedSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  }, [firestore]);

  React.useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleOpenDialog = (skill?: Skill) => {
    setCurrentSkill(skill || { 
      name: '', 
      category: 'Frontend', 
      icon: '', 
      order: skills.length, 
      visible: true 
    });
    setIsDialogOpen(true);
  };

  const handleSaveSkill = async () => {
    if (!currentSkill?.name || !currentSkill?.category || !firestore) return;

    setIsSaving(true);
    try {
      if (currentSkill.id) {
        const { id, ...data } = currentSkill;
        const skillRef = doc(firestore, 'skills', id);
        
        updateDoc(skillRef, data)
          .then(() => {
            setIsDialogOpen(false);
            fetchSkills();
            toast({ title: 'Success', description: 'Skill updated successfully.' });
          })
          .catch((error) => {
            const contextualError = new FirestorePermissionError({
              path: skillRef.path,
              operation: 'update',
              requestResourceData: data,
            });
            errorEmitter.emit('permission-error', contextualError);
          });
      } else {
        const colRef = collection(firestore, 'skills');
        addDoc(colRef, currentSkill as any)
          .then(() => {
            setIsDialogOpen(false);
            fetchSkills();
            toast({ title: 'Success', description: 'Skill added successfully.' });
          })
          .catch((error) => {
            const contextualError = new FirestorePermissionError({
              path: colRef.path,
              operation: 'create',
              requestResourceData: currentSkill,
            });
            errorEmitter.emit('permission-error', contextualError);
          });
      }
    } catch (err) {
      console.error('Save operation error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?') || !firestore) return;
    
    const skillRef = doc(firestore, 'skills', id);
    deleteDoc(skillRef)
      .then(() => {
        fetchSkills();
        toast({ title: 'Success', description: 'Skill deleted.' });
      })
      .catch((error) => {
        const contextualError = new FirestorePermissionError({
          path: skillRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', contextualError);
      });
  };

  if (loading && skills.length === 0) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills Inventory</CardTitle>
          <CardDescription>Manage the technical expertise displayed in your marquee rows.</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-full shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Skill</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id} className="group">
                <TableCell><GripVertical className="w-4 h-4 text-muted-foreground/30" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/50 p-1.5 overflow-hidden flex items-center justify-center">
                      {skill.icon ? (
                        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="font-semibold">{skill.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="shadow-sm">{skill.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={skill.visible ? "default" : "outline"} className="shadow-sm">
                    {skill.visible ? 'Visible' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(skill)} className="rounded-full">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-full" onClick={() => handleDeleteSkill(skill.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{currentSkill?.id ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
            <DialogDescription>Configure the skill details and visual representation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold">Skill Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. React, Python, Figma"
                value={currentSkill?.name || ''} 
                onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })} 
                className="rounded-xl shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-bold">Icon URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="icon" 
                  placeholder="https://cdn.jsdelivr.net/...svg"
                  value={currentSkill?.icon || ''} 
                  onChange={(e) => setCurrentSkill({ ...currentSkill, icon: e.target.value })} 
                  className="rounded-xl shadow-inner"
                />
                {currentSkill?.icon && (
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center p-2 border shadow-sm">
                    <img src={currentSkill.icon} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">Use a direct image URL or a DevIcon SVG link.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-bold">Category</Label>
                <Select 
                  value={currentSkill?.category} 
                  onValueChange={(val) => setCurrentSkill({ ...currentSkill, category: val })}
                >
                  <SelectTrigger className="rounded-xl shadow-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order" className="text-sm font-bold">Display Order</Label>
                <Input 
                  id="order" 
                  type="number" 
                  value={currentSkill?.order || 0} 
                  onChange={(e) => setCurrentSkill({ ...currentSkill, order: parseInt(e.target.value) || 0 })} 
                  className="rounded-xl shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="visible" className="text-sm font-bold">Show on Portfolio</Label>
                <p className="text-xs text-muted-foreground">Toggle visibility on the homepage marquee.</p>
              </div>
              <Switch 
                id="visible" 
                checked={currentSkill?.visible} 
                onCheckedChange={(val) => setCurrentSkill({ ...currentSkill, visible: val })} 
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full">Cancel</Button>
            <Button onClick={handleSaveSkill} disabled={isSaving} className="rounded-full shadow-lg shadow-primary/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {currentSkill?.id ? 'Save Changes' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
